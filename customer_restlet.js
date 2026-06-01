/**
 * @NApiVersion 2.1
 * @NScriptType restlet
 */
define(['N/record', 'N/search', 'N/log'], (record, search, log) => {

  const get = (context) => {
    try {
      const rec = record.load({
        type: record.Type.CUSTOMER,
        id: context.id
      });
      return {
        success: true,
        id: rec.id,
        name: rec.getValue('companyname'),
        email: rec.getValue('email'),
        phone: rec.getValue('phone')
      };
    } catch (e) {
      log.error('GET Error', e.message);
      return { success: false, error: e.message };
    }
  };

  const post = (context) => {
    try {
      if (!context.firstname || !context.lastname) {
        return { success: false, error: 'firstname and lastname required' };
      }

      const newRec = record.create({
        type: record.Type.CUSTOMER,
        isDynamic: true
      });

      newRec.setValue({ fieldId: 'isperson', value: "T" });
      newRec.setValue({ fieldId: 'firstname', value: context.firstname });
      newRec.setValue({ fieldId: 'lastname', value: context.lastname });
      newRec.setValue({ fieldId: 'email', value: context.email || '' });
      newRec.setValue({ fieldId: 'phone', value: context.phone || '' });
      newRec.setValue({ fieldId: 'subsidiary', value: context.subsidiary });
      newRec.setValue({ fieldId: 'parent', value: context.parent });
      newRec.setValue({ fieldId: 'category', value: context.category });
      newRec.setValue({ fieldId: 'entitystatus', value: context.entitystatus });

      const newId = newRec.save();
      return { success: true, id: newId };

    } catch (e) {
      log.error('POST Error', e.message);
      return { success: false, error: e.message };
    }
  };

  const put = (context) => {
    try {
      if (!context.id) {
        return { success: false, error: 'id is required' };
      }

      const rec = record.load({
        type: record.Type.CUSTOMER,
        id: context.id,
        isDynamic: true
      });

      if (context.firstname) rec.setValue({ fieldId: 'firstname', value: context.firstname });
      if (context.lastname) rec.setValue({ fieldId: 'lastname', value: context.lastname });
      if (context.email) rec.setValue({ fieldId: 'email', value: context.email });
      if (context.phone) rec.setValue({ fieldId: 'phone', value: context.phone });

      const updatedId = rec.save();
      return { success: true, id: updatedId, message: 'Customer updated' };

    } catch (e) {
      log.error('PUT Error', e.message);
      return { success: false, error: e.message };
    }
  };


  const doDelete = (context) => {
    try {
      log.debug('DELETE context', JSON.stringify(context));

      const recordId = Number(context.id);

      if (!recordId) {
        return { success: false, error: 'id is required' };
      }

      record.delete({
        type: record.Type.CUSTOMER,
        id: recordId
      });

      return { success: true, message: 'Customer deleted', id: recordId };

    } catch (e) {
      log.error('DELETE Error', e.message);
      return { success: false, error: e.message };
    }
  };

  return { get, post, put, delete: doDelete };
});