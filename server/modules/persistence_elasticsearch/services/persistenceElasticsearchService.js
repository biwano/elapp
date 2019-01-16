const elasticsearch = require('elasticsearch');
const queryHelper = require('../helpers/query');

const service = function service(elApp) {
  const persistence = {};

  persistence.elApp = elApp;
  persistence.docIndex = elApp.getConfig('persistence.index', 'elapp');
  persistence.docType = elApp.getConfig('persistence.type', 'elapp');
  persistence.host = elApp.getConfig('persistence.host');
  persistence.log = elApp.getConfig('persistence.log');
  persistence.drop = elApp.getConfig('persistence.drop', false);


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
    const index = `${this.docIndex}`;
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
      index,
      body: {
        properties,
      },
    });
  };

  persistence.search = function search(query) {
    const options = query.query.options;
    delete (query.query, 'options');
    elApp.logService.debug('persistence', JSON.stringify(query.query));
    const esQuery = queryHelper.encodeQuery(query.query);
    const body = { query: esQuery };
    Object.assign(body, options);
    elApp.logService.debug('persistence', JSON.stringify(esQuery));
    return this.es.search({
      index: this.docIndex,
      body,
    }).then(result => result.hits.hits.map(hit => hit._source));
  };

  persistence.get = function get(uuid) {
    const index = this.docIndex;
    return this.es.get({
      index,
      type: this.docType,
      id: uuid,
    }).then(hit => hit._source);
  };
  persistence.create = function createDocument(schemaId, uuid, doc) {
    const index = `${this.docIndex}`;
    return this.es.create({
      index,
      type: this.docType,
      id: uuid,
      body: doc,
    });
  };
  persistence.update = async function updateDocument(schemaId, uuid, bodyParts) {
    const doc = await this.get(uuid);
    Object.assign(doc, bodyParts);
    const index = `${this.docIndex}`;
    return this.es.index({
      index,
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
