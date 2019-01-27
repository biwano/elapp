
let NoopQuery;

const operators = {
  equals(p1, p2) {
    return NoopQuery({ op: '=', params: [p1, p2] });
  },
};
const Query = function Query(realm, originalExecutor) {
  return function makeQuery(originalQuery) {
    const res = {
      query: originalQuery,
      executor: originalExecutor,
      bind(executor) {
        this.executor = executor;
      },
      and(queries) {
        if (!Array.isArray(queries)) {
          queries = [queries];
        }
        if (typeof this.query !== 'undefined') {
          if (this.query.op !== 'and') {
            queries.push(NoopQuery(this.query));
            this.query = { op: 'and', params: queries };
          } else {
            this.query.params = this.query.params.concat(queries);
          }
        } else this.query = { op: 'and', params: queries };
      },
      setOption(key, value) {
        this.query.options = this.query.options || {};
        this.query.options[key] = value;
      },
      size(size) {
        this.setOption('size', size);
      },
      first() {
        this.size(1);
        return this.executor.search(realm, this).then(docs => (docs.length > 0 ? docs[0] : null));
      },
      all() {
        return this.executor.search(realm, this);
      },

    };
    // Add operators function
    Object.keys(operators).forEach((key) => { res[key] = operators[key]; });
    return res;
  };
};
NoopQuery = function NoopQuery(query) {
  return { query };
};

module.exports = { Query, equals: operators.equals };
