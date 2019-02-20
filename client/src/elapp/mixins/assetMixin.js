import http from '../services/http';

const loaders = {};
export default {
  methods: {
    getAssetURL(category, name) {
      return `asset/${category}/${name}`;
    },
    loadJavascriptAsset(category, name) {
      const key = `${category}|${name}`;
      if (typeof loaders[key] === 'undefined') {
        loaders[key] = http.loadScript(this.getAssetURL(category, name)).then((result) => {
          loaders[key] = true;
          return result;
        });
      } else if (loaders[key] === true) return Promise.resolve();
      return loaders[key];
    },
  },
};
