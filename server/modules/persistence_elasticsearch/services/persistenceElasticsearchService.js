const elasticsearch = require('elasticsearch');

const service = function service(elApp) {
  const persistence = {};

  persistence.elApp = elApp;
  persistence.docIndex = elApp.getConfig('persistence.index', 'elapp');
  persistence.docType = elApp.getConfig('persistence.type', 'elapp');
  persistence.host = elApp.getConfig('persistence.host');
  persistence.log = elApp.getConfig('persistence.log');
  persistence.drop = elApp.getConfig('persistence.drop', false);

  const decode = function decode(hit) {
    const doc = {};
    Object.keys(hit._source).forEach((esKey) => {
      let key;
      const keyParts = esKey.split('_');
      if (keyParts.length > 1) key = keyParts[1];
      else key = esKey;
      doc[key] = hit._source[esKey];
    });
    return doc;
  };
  const encode = function encode(doc) {
    const hit = {};
    Object.keys(doc).forEach((key) => {
      let esKey;
      if (key.startsWith('$')) esKey = key;
      else esKey = `${doc.$schema}_${key}`;
      hit[esKey] = doc[key];
    });
    return hit;
  };

  persistence.connect = function connect() {
    const es = new elasticsearch.Client({
      host: this.host,
      log: elApp.logService.getLogLevelName('persistence_backend'),
    });
    this.es = es;
    return new Promise(async (resolve) => {
      const index = `${this.docIndex}`;

      // Delete indice
      if (this.drop) {
        await es.indices.delete({
          index,
          ignoreUnavailable: true,
        });
      }
      // Ensure indice
      await es.indices.create({
        index,
        ignore: [400],
      });
      // Create mapping for system fields
      await this.es.indices.putMapping({
        type: this.docType,
        index,
        body: {
          properties: {
            $uuid: { type: 'keyword' },
            $schema: { type: 'keyword' },
            $acls: { type: 'object' },
            $localAcls: { type: 'object' },
          },
        },
      });
      resolve(true);
    });
    // return this.es;
  };

  persistence.registerSchema = async function registerSchema(params) {
    const identifier = params.identifier;
    const fields = params.fields;
    // Create the index if it does not exist
    const index = `${this.docIndex}`;
    const properties = {};
    Object.keys(fields).forEach((fieldName) => {
      // TODO: clean up field conversion from elapp to elasticsearch
      const elAppDefinition = fields[fieldName];
      if (elAppDefinition.type === 'list') elAppDefinition.type = elAppDefinition.objectsType;
      if (elAppDefinition.type === 'string') {
        elAppDefinition.type = 'text';
        elAppDefinition.index = false;
      }
      delete elAppDefinition.objectsType;

      properties[`${identifier}_${fieldName}`] = elAppDefinition;
    });

    // Create the mapping
    return this.es.indices.putMapping({
      type: this.docType,
      index,
      body: {
        properties,
      },
    });
  };

  persistence.matchDocuments = function getDocuments(params) {
    const index = `${this.docIndex}`;
    const filter = [];

    Object.keys(encode(params)).forEach((key) => {
      const term = {};
      if (typeof params[key] !== 'undefined') {
        term[key] = params[key];
        filter.push({ term });
      }
    });
    const body = {
      query: {
        bool: {
          filter,
        },
      },
    };
    return this.es.search({
      index,
      body,
    }).then(result => result.hits.hits.map(decode));
  };

  persistence.matchDocument = function matchDocument(matchParams) {
    return this.matchDocuments(matchParams).then(
      docs => (docs.length > 0 ? docs[0] : null));
  };
  persistence.get = function get(uuid) {
    const index = this.docIndex;
    return this.es.get({
      index,
      type: this.docType,
      id: uuid,
    }).then(result => decode(result));
  };
  persistence.createDocument = function createDocument(schemaId, uuid, doc) {
    const index = `${this.docIndex}`;
    return this.es.create({
      index,
      type: this.docType,
      id: uuid,
      body: encode(doc),
    });
  };
  persistence.updateDocument = async function updateDocument(schemaId, uuid, bodyParts) {
    const doc = await this.get(uuid);
    Object.assign(doc, bodyParts);
    const index = `${this.docIndex}`;
    return this.es.index({
      index,
      type: this.docType,
      id: uuid,
      body: encode(doc),
    });
  };
  return persistence;
};

module.exports = {
  name: 'persistenceElasticsearchService',
  service,
};
