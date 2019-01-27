const { Query, equals } = require('../helpers/query');

module.exports = {
  name: 'persistence',
  // Makes 'persistence' an alias for the actual persistence backend
  // Add adds generic functionnalities
  service(elApp) {
    const serviceId = elApp.getConfig('persistence.backend');
    const serviceName = elApp.utils.camelCase(`persistence_${serviceId}_service`);
    const S = elApp[serviceName];
    Object.assign(S, {
      Query(realm, query) {
        return Query(realm, this)(query);
      },
      matchQuery(realm, body) {
        const query = this.Query(realm);
        Object.keys(body).forEach((key) => {
          query.and(equals(key, body[key]));
        },
        );
        return query;
      },
      match(realm, body) {
        return this.matchQuery(realm, body).all();
      },
      matchOne(realm, body) {
        return this.matchQuery(realm, body).first();
      },
    });
    return elApp[serviceName];
  },
};
