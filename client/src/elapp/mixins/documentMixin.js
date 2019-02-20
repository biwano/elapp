import http from '../services/http';
import ComponentMixin from './componentMixin';

let loading;
export default {
  mixins: [ComponentMixin],
  methods: {
    init() {
      if (!this.Query) {
        if (typeof loading === 'undefined') {
          loading = http.loadScript(this.getComponentURL('query')).then(() => {
            // eslint-disable-next-line
            this.Q = { QueryBuilder, operators };
          });
        }
        return loading;
      }
      return Promise.resolve();
    },
    search(filterObject) {
      return this.init().then(() => {
        const filter = JSON.stringify(filterObject);
        return http.get('search', { params: { filter } });
      });
    },
    searchOne(filterObject) {
      // eslint-disable-next-line
      return this.search(filterObject).then(documents => {
        return (documents.length > 0 ? documents[0] : null);
      });
    },
    count(filterObject) {
      return this.init().then(() => {
        const filter = JSON.stringify(filterObject);
        return http.get('count', { params: { filter } });
      });
    },
    matchQuery(body) {
      return this.init().then(() => this.Q.QueryBuilder().match(body));
    },
  },
};
