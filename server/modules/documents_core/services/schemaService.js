const NodeCache = require('node-cache');

const service = function service(elApp) {
  const cache = new NodeCache();
  return function makeService(acls, schemaId, realm) {
    if (typeof realm === 'undefined') realm = elApp.realmService.defaultRealm;
    return {
      get schema() {
        return new Promise(async (resolve, reject) => {
          let schema = cache.get(`schema_${realm}_${schemaId}`);
          // elApp.logService.trace('documents', `Getting schema '${schemaId}'`);
          if (typeof schema === 'undefined') {
            schema = await elApp.persistence.matchOne(realm, { $schema: 'schema', identifier: schemaId });
            if (schema !== null) {
              cache.set(`schema_${realm}_${schemaId}`, schema);
            } else reject(`[ DocumentService ] Schema not found: '${realm}_${schemaId}'`);
          }
          resolve(schema);
        });
      },
      async register(params) {
        const identifier = params.identifier;
        const fields = params.fields;
        let key = params.key;
        const schemaAcls = [{ 'group:member': 'read' }];
        const documentService = elApp.DocumentService(acls, realm);
        elApp.logService.debug('documents', `Registering schema: ${params.identifier}`);
        try {
          if (typeof key === 'undefined') key = [];
          if (typeof key === 'string') key = [key];
          // Register the schema/*
          await elApp.persistence.registerSchema(realm, params);
          const schema = {
            identifier,
            key,
            fields,
            $localAcls: schemaAcls,
          };
          cache.set(`schema_${realm}_${identifier}`, schema);
          elApp.logService.debug('documents', `Caching schema '${realm}_${identifier}'`);

          // Save the definition of the schema in the schema collection if it does not exist
          return documentService.createIfAbsent('schema', schema);
        } catch (e) {
          const error = `Error registering schema '${realm} ${identifier}' ${e}`;
          elApp.logService.error('documents', error);
          return Promise.resolve(error);
        }
      },
    };
  };
};

module.exports = {
  name: 'SchemaService',
  service,
};
