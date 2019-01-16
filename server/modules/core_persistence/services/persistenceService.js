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
      Query(query) {
        return Query(this)(query);
      },
      matchQuery(body) {
        const query = this.Query();
        Object.keys(body).forEach((key) => {
          query.and(equals(key, body[key]));
        },
        );
        return query;
      },
      match(body) {
        return this.matchQuery(body).all();
      },
      matchOne(body) {
        return this.matchQuery(body).first();
      },
    });
    return elApp[serviceName];
  },
};
