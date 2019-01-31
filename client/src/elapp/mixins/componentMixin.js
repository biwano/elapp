import http from '../services/http';

export default {
  methods: {
    getComponent(component) {
      return http.get(`component/${component}`);
    },
  },
};
