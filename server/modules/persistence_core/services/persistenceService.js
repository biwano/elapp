const { Query } = require('../components/query');

module.exports = {
  name: 'persistence',
  // Makes 'persistence' an alias for the actual persistence backend
  // Add adds generic functionnalities
  service(elApp) {
    const serviceId = elApp.getConfig('persistence.backend');
    const serviceName = elApp.utils.camelCase(`persistence_${serviceId}_service`);
    const S = elApp[serviceName];
    S.searchBackend = S.search;
    S.countBackend = S.count;
    Object.assign(S, {
      Query(realm, query) {
        return Query(realm, this)(query);
      },
      matchQuery(realm, body) {
        return Query(realm, this)().match(body);
      },
      match(realm, body) {
        return this.matchQuery(realm, body).all();
      },
      matchOne(realm, body) {
        return this.matchQuery(realm, body).first();
      },
      search(realm, body) {
        return this.Query(realm, body).all();
      },
      count(realm, body) {
        return this.Query(realm, body).count();
      },
    });
    return elApp[serviceName];
  },
};
