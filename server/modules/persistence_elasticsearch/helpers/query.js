// Converts an elApp query into an elasticserach query
module.exports = {
  // checks if a string is quoted
  unQuote(str) {
    if (typeof str === 'string' && str[0] === "'" && str[str.length - 1] === "'") {
      return str.substring(1, str.length - 1);
    }
    return str;
  },
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
      term[params[0]] = this.unQuote(params[1]);
      return { term };
    }
    return {};
  },
};
