import http from '../services/http';

export default {
  methods: {
    search(queryObject) {
      const query = JSON.stringify(queryObject);
      return http.get('search', { params: { query } });
    },
  },
};
