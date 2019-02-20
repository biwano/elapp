import http from '../services/http';
import AssetMixin from './assetMixin';

export default {
  mixins: [AssetMixin],
  methods: {
    init() {
      if (!this.Q) {
        return this.loadJavascriptAsset('helpers', 'query.js').then(() => {
          // eslint-disable-next-line
            this.Q = { QueryBuilder, operators };
        });
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
