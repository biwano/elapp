// eslint-disable-next-line
let operators = {
  equals(p1, p2) {
    return { $op: '=', $params: [p1, p2] };
  },
};
// eslint-disable-next-line
let Query = function Query(realm, originalExecutor) {
  return function makeQuery(filter, options) {
    const res = {
      filter,
      executor: originalExecutor,
      options,
      bind(executor) {
        this.executor = executor;
      },
      // Adds queries which must be all true
      and(filters_) {
        let filters = filters_;
        if (!Array.isArray(filters)) {
          filters = [filters];
        }
        if (typeof this.filter !== 'undefined') {
          if (this.filter.$op !== 'and') {
            filters.push(this.filter);
            this.filter = { $op: 'and', $params: filters };
          } else {
            this.filter.$params = this.filter.$params.concat(filters);
          }
        } else this.filter = { $op: 'and', $params: filters };
      },
      // Creates a match filter
      match(body) {
        Object.keys(body).forEach((key) => {
          let val = body[key];
          // quote strings
          if (typeof val === 'string') val = `'${val}'`;
          this.and(operators.equals(key, val));
        });
        return this;
      },
      // sets an option
      setOption(key, value) {
        this.options = this.options || {};
        this.options[key] = value;
      },
      // Sets Size option
      size(size) {
        this.setOption('size', size);
      },
      // Returns a leaned version of this query for the executor
      getFilter() {
        return {
          filter: this.filter,
          options: this.options,
        };
      },
      execute() {
        return this.executor.searchBackend(realm, { filter: this.filter, options: this.options });
      },
      // Executes query and returns first result
      first() {
        this.size(1);
        return this.execute().then(docs => (docs.length > 0 ? docs[0] : null));
      },
      // Executes query and returns all results
      all() {
        return this.execute();
      },
      // Counts the number of results in query
      count() {
        return this.executor.countBackend(realm, { filter: this.filter, options: this.options });
      },
    };
    // Add operators function
    Object.keys(operators).forEach((key) => { res[key] = operators[key]; });
    return res;
  };
};
const QueryBuilder = function QueryBuilder() {
  return Query()();
};
try {
  module.exports = { Query, QueryBuilder, equals: operators.equals, operators };
} catch (e) {}
