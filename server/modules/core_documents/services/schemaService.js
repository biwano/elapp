const NodeCache = require('node-cache');

const service = function service(elApp) {
  return {
    // Creates a document if the key is not used
    cache: new NodeCache(),
    get(schemaIdentifier) {
      return new Promise(async (resolve, reject) => {
        let schema = this.cache.get(`schema_${schemaIdentifier}`);
        if (typeof schema === 'undefined') {
          schema = await elApp.persistence.getDocument({ $schema: 'schema', identifier: schemaIdentifier });
          if (schema !== null) {
            this.cache.set(`schema_${schemaIdentifier}`, schema);
          } else reject(`[ DocumentService ] Schema not found: ${schemaIdentifier}`);
        }
        resolve(schema);
      });
    },
    async keyUsed(schemaIdentifier, key) {
      const doc = await elApp.documentService.getByKey(schemaIdentifier, key);
      return doc !== null;
    },
    async register(params) {
      const identifier = params.identifier;
      const fields = params.fields;
      let key = params.key;
      elApp.logService.debug('documents', `Registering schema: ${params.identifier}`);
      if (typeof key === 'undefined') key = [];
      if (typeof key === 'string') key = [key];
      // Register the schema
      await elApp.persistence.registerSchema(params);
      const schema = {
        identifier,
        key,
        fields,
      };
      this.cache.set(`schema_${identifier}`, schema);

      // Save the definition of the schema in the schema collection if it does not exist
      return elApp.documentService.create('schema', schema);
    },
  };
};

module.exports = {
  name: 'schemaService',
  service,
};
