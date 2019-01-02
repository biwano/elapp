/* Module that makes persistence pluggable
 * by depending on the persistence module that does the real work
 * This module should create a persistence object in elApp that implements:
 *  connect() => Connect to the database
 *  createCollection(name, fields) => Create a collection given a name and an object representing field definitions elasticearch style
*/
module.exports = {
  name: 'core_persistence',
  dependencies(elApp) {
    return ['core_logging', `persistence_${elApp.getConfig('persistence.backend')}`];
  },
  init(elApp) {
    elApp.logService.trace('persistence', 'Connecting');
    return elApp.persistence.connect();
  },

};
