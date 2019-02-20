import Vue from 'vue';
import AssetMixin from './assetMixin';
import http from '../services/http';

export default {
  mixins: [AssetMixin],
  methods: {
    getComponentURL(component) {
      return this.getAssetURL('components', `${component}.js`);
    },
    withComponent(componentName, alias_) {
      let alias = alias_;
      if (typeof alias === 'undefined') alias = componentName;
      // Component already loaded
      if (Object.keys(Vue.options.components).indexOf(alias) >= 0) {
        return Promise.resolve(Vue.options.components[alias_]);
      }
      // Load component
      return Vue.component(alias, (resolve) => {
        http.loadScript(this.getComponentURL(componentName)).then(() => {
        // eslint-disable-next-line
          resolve(ElAppRemoteComponent);
        });
      });
    },
  },
};
