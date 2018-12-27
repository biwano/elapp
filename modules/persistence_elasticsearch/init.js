const elasticsearch = require('elasticsearch');

module.exports = function init(elApp) {
  const persistence = {};

  persistence.elApp = elApp;
  persistence.prefix = elApp.getConfig('persistence.indexPrefix', 'elapp_');
  persistence.host = elApp.getConfig('persistence.host');
  persistence.log = elApp.getConfig('persistence.log');

  persistence.connect = function connect() {
    this.es = new elasticsearch.Client({
      host: this.host,
      log: this.log,
    });
    return this.es;
  };

  persistence.setCollection = async function setCollection(name, fields) {
    const properties = {};
    Object.keys(fields).forEach((fieldName) => {
      const elAppDefinition = fields[fieldName];
      properties[fieldName] = elAppDefinition;
    });
    console.log(properties);
    await this.es.indices.create({
    	index: `${this.prefix}${name}`,
    	ignore: [400],
    });
    await this.es.indices.putMapping({
      type: 'schema',
      index: `${this.prefix}schema`,
      body: {
        properties,
      },
    });
  };


  elApp.persistence = persistence;
};

