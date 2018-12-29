const elasticsearch = require('elasticsearch');

module.exports = function init(elApp) {
  const persistence = {};

  persistence.elApp = elApp;
  persistence.indexPrefix = elApp.getConfig('persistence.indexPrefix', 'elapp_');
  persistence.docsIndex = `${persistence.indexPrefix}docs`;
  persistence.host = elApp.getConfig('persistence.host');
  persistence.log = elApp.getConfig('persistence.log');

  persistence.connect = function connect() {
    this.es = new elasticsearch.Client({
      host: this.host,
      log: this.log,
    });
    return this.es;
  };

  persistence.registerSchema = async function registerSchema(params) {
    const identifier = params.identifier;
    const fields = params.fields;
    // Create the index if it does not exist
    const index = `${this.indexPrefix}${identifier}`;
    await this.es.indices.create({
      index,
      ignore: [400],
    });
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

      properties[fieldName] = elAppDefinition;
    });
    // Create the mapping
    return this.es.indices.putMapping({
      type: identifier,
      index,
      body: {
        properties,
      },
    });
  };

  persistence.getDocuments = function getDocuments(params) {
    const index = `${this.indexPrefix}*`;
    const filter = [];

    Object.keys(params).forEach((key) => {
      const term = {};
      term[key] = params[key];
      filter.push({ term });
    });
    const body = {
      query: {
        bool: {
          filter,
        },
      },
    };
    // console.log(body);
    // console.log(filter);
    return this.es.search({
      index,
      body,
    }).then(result => result.hits.hits);
  };

  persistence.getDocument = function getDocument(matchParams) {
    return this.getDocuments(matchParams).then(
      hits => (hits.length > 0 ? hits[0]._source : null));
  };
  persistence.putDocument = function putDocument(schema, document) {
    const index = `${this.indexPrefix}${schema}`;
    return this.es.index({
      index,
      type: schema,
      body: document,
    });
  };

  elApp.persistence = persistence;
//  return new Promise(resolve => resolve());
};

