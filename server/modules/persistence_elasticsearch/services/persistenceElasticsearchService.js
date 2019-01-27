const elasticsearch = require('elasticsearch');
const queryHelper = require('../helpers/query');

const service = function service(elApp) {
  const persistence = {};

  persistence.elApp = elApp;
  persistence.docType = elApp.getConfig('persistence.type', 'elapp');
  persistence.host = elApp.getConfig('persistence.host');
  persistence.log = elApp.getConfig('persistence.log');


  persistence.connect = function connect() {
    this.es = new elasticsearch.Client({
      host: this.host,
      log: elApp.logService.getLogLevelName('persistence_backend'),
    });
    return this.es;
  };
  persistence.deleteRealm = function deleteRealm(realm) {
    return this.es.indices.delete({
      index: realm,
      ignoreUnavailable: true,
    });
  };
  persistence.createRealm = function createRealm(realm) {
    // Ensure indice
    return this.es.indices.create({
      index: realm,
      ignore: [400],
    }).then(() =>
      // Create mapping for system fields
      this.es.indices.putMapping({
        type: this.docType,
        index: realm,
        body: {
          properties: {
            $uuid: { type: 'keyword' },
            $schema: { type: 'keyword' },
            $acls: { type: 'object' },
            $localAcls: { type: 'object' },
          },
        },
      }));
  };

  persistence.registerSchema = async function registerSchema(realm, params) {
    const identifier = params.identifier;
    const fields = params.fields;
    const properties = {};
    // create mapping properties
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
      index: realm,
      body: {
        properties,
      },
    });
  };

  persistence.search = function search(realm, query) {
    const options = query.query.options;
    delete (query.query, 'options');
    elApp.logService.debug('persistence', JSON.stringify(query.query));
    const esQuery = queryHelper.encodeQuery(query.query);
    const body = { query: esQuery };
    Object.assign(body, options);
    elApp.logService.debug('persistence', JSON.stringify(esQuery));
    return this.es.search({
      index: realm,
      body,
    }).then(result => result.hits.hits.map(hit => hit._source));
  };

  persistence.get = function get(realm, uuid) {
    return this.es.get({
      index: realm,
      type: this.docType,
      id: uuid,
    }).then(hit => hit._source);
  };
  persistence.create = function createDocument(realm, schemaId, uuid, doc) {
    return this.es.create({
      index: realm,
      type: this.docType,
      id: uuid,
      body: doc,
    });
  };
  persistence.update = async function updateDocument(realm, schemaId, uuid, bodyParts) {
    const doc = await this.get(realm, uuid);
    Object.assign(doc, bodyParts);
    return this.es.index({
      index: realm,
      type: this.docType,
      id: uuid,
      body: doc,
    });
  };
  return persistence;
};

module.exports = {
  name: 'persistenceElasticsearchService',
  service,
};
