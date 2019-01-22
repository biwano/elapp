import BooleanRadio from './components/booleanRadio';
import Breadcrumbs from './components/breadcrumbs';
import Icon from './components/icon';
import Messages from './components/messages';
import Suggestion from './components/suggestion';
import Tabs from './components/tabs';

import LocalAuth from './components/localAuth';

import { LocalesMixin, locales } from './mixins/localesMixin';
import AuthMixin from './mixins/authMixin';
import MessagesMixin from './mixins/messagesMixin';
import NavMixin from './mixins/navMixin';

import MessagesStore from './store/messagesStore';
import AuthStore from './store/authStore';

import http from './services/http';

export default {
  Components: {
    BooleanRadio,
    Breadcrumbs,
    Icon,
    Messages,
    Suggestion,
    Tabs,

    LocalAuth,
  },
  Mixins: {
    NavMixin,
    MessagesMixin,
    AuthMixin,
  },
  Stores: {
    MessagesStore,
    AuthStore,
  },
  install(Vue, options) {
    http.init(options);
    // 3. injecter des options de composant
    Vue.mixin(LocalesMixin);
  },
  loadLocale(languageName, dictionnary) {
    locales.$load(languageName, dictionnary);
  },
};
