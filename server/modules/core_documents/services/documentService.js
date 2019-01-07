const uuidv1 = require('uuid/v1');
const NodeCache = require('node-cache');

const service = function service(elApp) {
  return function makeService(acls) {
    return {
    // Creates a document if the key is not used
      cache: new NodeCache(),
      async create(schemaIdentifier, body_) {
        const body = Object.assign({}, body_);
        const schemaService = elApp.SchemaService(acls);

        if (!await schemaService.keyUsed(schemaIdentifier, body)) {
        // Adds the schema to the body
          body.$schema = schemaIdentifier;
          // Creates an uuid if none is given
          body.$uuid = uuidv1();
          // Checks the document consistency
          this.check(body);
          // Saves the document
          elApp.logService.trace('documents', `Creating document with schema: ${schemaIdentifier}`);
          return elApp.persistence.putDocument(schemaIdentifier, body);
        }
        return null;
      },
      async check(body) {
        const schema = await elApp.schemaService.get(body.$schema);
        if (schema === null || typeof schema === 'undefined') throw new Error('Ek!');
      },
      async getByKey(schemaIdentifier, key) {
        const schemaService = elApp.SchemaService(acls);
        const schema = await schemaService.get(schemaIdentifier);
        let doc = null;
        if (typeof schema.key !== 'undefined') {
          const matchParams = { $schema: schemaIdentifier };
          schema.key.forEach((keyName) => { matchParams[keyName] = key[keyName]; });
          doc = await elApp.persistence.getDocument(matchParams);
        }
        return doc;
      },
    };
  };
};

module.exports = {
  name: 'DocumentService',
  service,
};
