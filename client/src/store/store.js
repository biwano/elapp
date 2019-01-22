import Vuex from 'vuex';
import Elapp from 'elapp';
import config from '@/config';


const createStore = function store() {
  return new Vuex.Store({
    state: {
      version: config.version,
    },
    mutations: {
    },
    modules: {
      message: Elapp.Stores.MessagesStore,
      auth: Elapp.Stores.AuthStore,
    },
  });
};

export default createStore;
