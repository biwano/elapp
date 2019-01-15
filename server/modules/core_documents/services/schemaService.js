const NodeCache = require('node-cache');

const service = function service(elApp) {
  const cache = new NodeCache();
  return function makeService(acls, schemaId) {
    return {
      get schema() {
        return new Promise(async (resolve, reject) => {
          let schema = cache.get(`schema_${schemaId}`);
          // elApp.logService.trace('documents', `Getting schema '${schemaId}'`);
          if (typeof schema === 'undefined') {
            schema = await elApp.persistence.matchDocument({ $schema: 'schema', identifier: schemaId });
            if (schema !== null) {
              cache.set(`schema_${schemaId}`, schema);
            } else reject(`[ DocumentService ] Schema not found: ${schemaId}`);
          }
          resolve(schema);
        });
      },
      async register(params) {
        const identifier = params.identifier;
        const fields = params.fields;
        let key = params.key;
        const schemaAcls = [{ 'group:member': 'read' }];
        const documentService = elApp.DocumentService(acls);
        elApp.logService.debug('documents', `Registering schema: ${params.identifier}`);
        try {
          if (typeof key === 'undefined') key = [];
          if (typeof key === 'string') key = [key];
          // Register the schema/*
          await elApp.persistence.registerSchema(params);
          const schema = {
            identifier,
            key,
            fields,
            $localAcls: schemaAcls,
          };
          cache.set(`schema_${identifier}`, schema);
          elApp.logService.trace('documents', `Caching schema '${identifier}'`);

          // Save the definition of the schema in the schema collection if it does not exist
          return documentService.create('schema', schema);
        } catch (e) {
          const error = `Error registering schema '${identifier}'`;
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
