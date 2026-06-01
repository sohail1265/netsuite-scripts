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

    newRec.setValue({ fieldId: 'isperson',     value: "T" });
    newRec.setValue({ fieldId: 'firstname',    value: context.firstname });
    newRec.setValue({ fieldId: 'lastname',     value: context.lastname });
    newRec.setValue({ fieldId: 'email',        value: context.email || '' });
    newRec.setValue({ fieldId: 'phone',        value: context.phone || '' });
    newRec.setValue({ fieldId: 'subsidiary',   value: context.subsidiary });
    newRec.setValue({ fieldId: 'parent',       value: context.parent });
    newRec.setValue({ fieldId: 'category',     value: context.category });
    newRec.setValue({ fieldId: 'entitystatus', value: context.entitystatus });

    const newId = newRec.save();
    return { success: true, id: newId };

  } catch (e) {
    log.error('POST Error', e.message);
    return { success: false, error: e.message };
  }
};

  return { get, post };
});
