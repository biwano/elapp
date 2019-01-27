const operators = {
  equals(p1, p2) {
    return { $op: '=', $params: [p1, p2] };
  },
};
const Query = function Query(realm, originalExecutor) {
  return function makeQuery(filter, options) {
    const res = {
      filter,
      executor: originalExecutor,
      options,
      bind(executor) {
        this.executor = executor;
      },
      // Adds queries which must be all true
      and(filters) {
        if (!Array.isArray(filters)) {
          filters = [filters];
        }
        if (typeof this.query !== 'undefined') {
          if (this.filter.$op !== 'and') {
            filters.push(this.filter);
            this.filter = { $op: 'and', $params: filters };
          } else {
            this.filter.$params = this.filter.$params.concat(filters);
          }
        } else this.filter = { $op: 'and', $params: filters };
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

    };
    // Add operators function
    Object.keys(operators).forEach((key) => { res[key] = operators[key]; });
    return res;
  };
};

module.exports = { Query, equals: operators.equals };
