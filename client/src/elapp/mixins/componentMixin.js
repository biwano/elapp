import http from '../services/http';

export default {
  methods: {
    getComponentURL(component) {
      return `component/${component}`;
    },
    loadComponent(component) {
      return http.loadScript(this.getComponentURL(component));
    },
    getComponent(component) {
      return http.get(`component/${component}`);
    },
  },
};
