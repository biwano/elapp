import Vuex from 'vuex';
import Vuano from 'vuano';
import config from '@/config';


const createStore = function store() {
  return new Vuex.Store({
    state: {
      version: config.version,
    },
    mutations: {
    },
    modules: {
      message: Vuano.Stores.MessagesStore,
      auth: Vuano.Stores.AuthStore,
    },
  });
};

export default createStore;
