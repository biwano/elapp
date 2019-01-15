const uuidv1 = require('uuid/v1');
const NodeCache = require('node-cache');

const service = function service(elApp) {
  const defaultAcls = elApp.getConfig('document.defaultAcls', [{ 'group:admin': 'write' }]);
  return function makeService(acls) {
    return {
    // Creates a document if the key is not used
      cache: new NodeCache(),
      getSchemaService(doc) {
        return elApp.SchemaService(acls, doc.$schema);
      },
      getSchema(doc) {
        return this.getSchemaService(doc).schema;
      },
      async create(schemaId, body_) {
        const body = Object.assign({}, body_);
        body.$schema = schemaId;

        if (!await this.keyUsed(schemaId, body)) {
          // Adds the schema to the body
          // Creates an uuid
          body.$uuid = uuidv1();
          // Ensure acls
          if (body.$localAcls === 'undefined') { body.$localAcls = []; }
          // Checks the document consistency
          this.check(body);
          // Saves the document
          elApp.logService.trace('documents', `Creating document with schema: ${schemaId} ${body.$uuid}`);
          return elApp.persistence.createDocument(schemaId, body.$uuid, body).then((doc) => {
            this.updateAcls(body.$uuid);
            return doc;
          });
        }
        elApp.logService.error('documents', `Cannot create document with schema: ${schemaId}. Duplicate key ${JSON.stringify(await this.keyFromBody(schemaId, body_))}`);

        return Promise.resolve(null);
      },
      async keyUsed(schemaId, key) {
        const doc = await this.getByKey(schemaId, key);
        return doc !== null;
      },
      async updateAcls(uuid) {
        const doc = await elApp.persistence.get(uuid);
        // TODO: inherit parent acls
        const $acls = (doc.$localAcls || []).concat(defaultAcls);
        elApp.persistence.updateDocument(doc.$schema, uuid, { $acls });


        // const schema = await this.getelApp.SchemaService(acls, body.$schema).schema;
      },
      async check(body) {
        const schema = await elApp.SchemaService(acls, body.$schema).schema;
        if (schema === null || typeof schema === 'undefined') throw new Error('Ek!');
      },
      async keyFromBody(schemaId, body) {
        let key;
        const schemaService = elApp.SchemaService(acls, schemaId);
        const schema = await schemaService.schema;
        if (typeof schema.key !== 'undefined') {
          key = {};
          schema.key.forEach((keyName) => { key[keyName] = body[keyName]; });
        }
        return key;
      },
      async getByKey(schemaId, key) {
        let doc = null;
        const matchParams = { $schema: schemaId };
        Object.assign(matchParams, await this.keyFromBody(schemaId, key));
        doc = await elApp.persistence.matchDocument(matchParams);
        return doc;
      },
    };
  };
};

module.exports = {
  name: 'DocumentService',
  service,
};
