// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.min.css';
import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import Vuano from 'vuano';
import createStore from '@/store/store';
import App from './App';
import router from './router/routes';
import config from './config';
import en from './locales/en';

// loads the Icon plugin
UIkit.use(Icons);

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(Vuano, config);
const store = createStore();
Vuano.loadLocale('en', en);

Vue.filter('formatDate', value => (value ? moment(String(value)).format('DD MMM YYYY hh:mm') : undefined));
// Injecting mixins
Vue.mixin(Vuano.Mixins.NavMixin);
Vue.mixin(Vuano.Mixins.MessagesMixin);

// Importing components globally
Vue.component('suggestion', Vuano.Components.Suggestion);
Vue.component('icon', Vuano.Components.Icon);
Vue.component('boolean-radio', Vuano.Components.BooleanRadio);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
