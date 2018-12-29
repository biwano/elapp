const uuidv1 = require('uuid/v1');
const NodeCache = require('node-cache');

const service = function service(elApp) {
  return {
    // Creates a document if the key is not used
    cache: new NodeCache(),
    async createDocument(schemaIdentifier, body_) {
      const body = Object.assign({}, body_);

      if (!await this.keyUsed(schemaIdentifier, body)) {
        // Adds the schema to the body
        body.$schema = schemaIdentifier;
        // Creates an uuid if none is given
        body.$uuid = uuidv1();
        // Checks the document consistency
        this.checkDocument(body);
        // Saves the document
        return elApp.persistence.putDocument(schemaIdentifier, body);
      }
      return null;
    },
    async checkDocument(body) {
      const schema = await this.getSchema(body.$schema);
      if (schema === null || typeof schema === 'undefined') throw new Error('Ek!');
    },
    getSchema(schemaIdentifier) {
      return new Promise(async (resolve, reject) => {
        let schema = this.cache.get(`schema_${schemaIdentifier}`);
        if (typeof schema === 'undefined') {
          schema = await elApp.persistence.getDocument({ $schema: 'schema', identifier: schemaIdentifier });
          console.log(schemaIdentifier);
          if (schema !== null) {
            this.cache.set(`schema_${schemaIdentifier}`, schema);
          } else reject(`[ DocumentService ] Schema not found: ${schemaIdentifier}`);
        }
        resolve(schema);
      });
    },
    async keyUsed(schemaIdentifier, key) {
      const doc = await this.getDocumentByKey(schemaIdentifier, key);
      return doc !== null;
    },
    async getDocumentByKey(schemaIdentifier, key) {
      const schema = await this.getSchema(schemaIdentifier);
      let doc = null;
      if (typeof schema.key !== 'undefined') {
        const matchParams = { $schema: schemaIdentifier };
        schema.key.forEach((keyName) => { matchParams[keyName] = key[keyName]; });
        doc = await elApp.persistence.getDocument(matchParams);
      }
      return doc;
    },
    async registerSchema(params) {
      const identifier = params.identifier;
      const fields = params.fields;
      let key = params.key;
      console.log(`[ DocumentService ] Registering schema: ${params.identifier}`);
      if (typeof key === 'undefined') key = [];
      if (typeof key === 'string') key = [key];
      // Create the collection if it dos not exist
      await elApp.persistence.registerSchema(params);
      const schema = {
        identifier,
        key,
        fields,
      };
      this.cache.set(`schema_${identifier}`, schema);

      // Saves the definition of the schema in the schema collection if it does not exist
      return this.createDocument('schema', schema);
    },
  };
};

module.exports = {
  name: 'documentService',
  service,
};
