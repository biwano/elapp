import http from '../services/http';
import { equals, Query } from '../services/query';

export default {
  methods: {
    search(filterObject) {
      const filter = JSON.stringify(filterObject);
      return http.get('search', { params: { filter } });
    },
    matchQuery(body) {
      const query = Query()();
      Object.keys(body).forEach((key) => {
        query.and(equals(key, body[key]));
      });
      return query;
    },
  },
};
