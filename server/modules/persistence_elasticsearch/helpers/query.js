// Converts an elApp query into an elasticserach query
module.exports = {
  encodeFilter(query) {
    const filter = [];
    const params = query.$params;
    const op = query.$op;
    if (op === 'and') {
      params.forEach((elAppFilter) => {
        filter.push(this.encodeFilter(elAppFilter));
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
