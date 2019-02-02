import Components from './components';

import { locales } from './mixins/localesMixin';
import Mixins from './mixins';
import MessagesStore from './store/messagesStore';
import AuthStore from './store/authStore';

import Routes from './routes';

import http from './services/http';

const Elapp = {
  Components,
  Mixins,
  Stores: {
    MessagesStore,
    AuthStore,
  },
  Routes,
  install(Vue, options) {
    http.init(options);
    // 3. injecter des options de composant
    Vue.mixin(Mixins.LocalesMixin);
  },
  loadLocale(languageName, dictionnary) {
    locales.$load(languageName, dictionnary);
  },
};
export default Elapp;
