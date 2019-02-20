const uuidv1 = require('uuid/v1');
const NodeCache = require('node-cache');
const codecs = require('../helpers/codecs');

const service = function service(elApp) {
  return function makeService(acls, realm) {
    if (typeof realm === 'undefined') realm = elApp.realmService.defaultRealm;
    const defaultAcls = elApp.realmService.defaultAcls;
    if (!Array.isArray(acls)) acls = [acls];
    return {
    // Creates a document if the key is not used
      cache: new NodeCache(),
      getSchemaService(doc) {
        return elApp.SchemaService(acls, doc.$schema);
      },
      getSchema(doc) {
        return this.getSchemaService(doc).schema;
      },
      async createBackend(schemaId, body_) {
        let body = Object.assign({}, body_);
        body.$schema = schemaId;
        // Adds the schema to the body
        // Creates an uuid
        body.$uuid = uuidv1();
        // Ensure acls
        if (body.$localAcls === 'undefined') { body.$localAcls = []; }
        //
        elApp.invokeHooks('document_before_create', body);
        // Checks the document consistency
        this.check(body);
        // Saves the document
        elApp.logService.trace('documents', `Creating ${schemaId} document ${body.$uuid}`);
        elApp.logService.debug('documents', body);
        body = codecs.encode(body);
        return elApp.persistence.create(realm, schemaId, body.$uuid, body).then((doc) => {
          this.updateAcls(body.$uuid);
          return doc;
        });
      },
      async create(schemaId, body_) {
        this.createIfAbsent(schemaId, body_).then(async (response) => {
          if (response === null) {
            const key = JSON.stringify(await this.keyFromBody(schemaId, body_));
            elApp.logService.error('documents', `Cannot create document with schema: ${schemaId}. Duplicate key ${key}}`);
          }
          return response;
        });
      },
      async createIfAbsent(schemaId, body_) {
        if (!await this.keyUsed(schemaId, body_)) {
          return this.createBackend(schemaId, body_);
        }
        return Promise.resolve(null);
      },
      async keyUsed(schemaId, key) {
        const doc = await this.getByKey(schemaId, key);
        return doc !== null;
      },
      async updateAcls(uuid) {
        const doc = await elApp.persistence.get(realm, uuid);
        // TODO: inherit parent acls
        const $acls = (doc.$localAcls || []).concat(defaultAcls);
        elApp.persistence.update(realm, doc.$schema, uuid, { $acls });
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
          schema.key.forEach((keyName) => {
            key[keyName] = typeof body === 'object' ? body[keyName] : body;
          });
        }
        return key;
      },
      async getByKey(schemaId, body) {
        const key = await this.keyFromBody(schemaId, body);
        key.$schema = schemaId;
        return this.matchOne(key);
      },
      async matchOne(body) {
        let doc = null;
        let params = Object.assign({}, body);
        params = codecs.encode(params);
        doc = await elApp.persistence.matchOne(realm, params);
        return codecs.decode(doc);
      },
      async match(body) {
        let docs = [];
        let params = Object.assign({}, body);
        params = codecs.encode(params);
        docs = await elApp.persistence.match(realm, params);
        return docs.map(doc => codecs.decode(doc));
      },
      async search(query) {
        let docs = [];
        let params = Object.assign({}, query);
        params = codecs.encodeQuery(params);
        docs = await elApp.persistence.search(realm, params);
        return docs.map(doc => codecs.decode(doc));
      },
      async count(query) {
        let params = Object.assign({}, query);
        params = codecs.encode(params);
        return elApp.persistence.count(realm, params);
      },
    };
  };
};

module.exports = {
  name: 'DocumentService',
  service,
};
