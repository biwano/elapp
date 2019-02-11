import Vue from 'vue';
import http from '../services/http';

export default {
  methods: {
    getComponentURL(component) {
      return `component/${component}.js`;
    },
    loadComponent(componentName, alias_) {
      let alias = alias_;
      if (typeof alias === 'undefined') alias = componentName;
      return Vue.component(alias, (resolve) => {
        http.loadScript(this.getComponentURL(componentName)).then(() => {
        // eslint-disable-next-line
          resolve(ElAppRemoteComponent);
        });
      });
    },
    getComponent(component) {
      return http.get(`component/${component}`);
    },
  },
};
