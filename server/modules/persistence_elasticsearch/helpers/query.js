// Converts an elApp query into an elasticserach query
module.exports = {
  encodeQuery(query) {
    const filter = [];
    const params = query.params;
    const op = query.op;
    if (op === 'and') {
      params.forEach((innerQuery) => {
        filter.push(this.encodeQuery(innerQuery.query));
      });
      return {
        bool: { filter },
      };
    }
    if (op === '=') {
      const term = {};
      term[params[0]] = params[1];
      return { term };
    }
    return {};
  },
};
