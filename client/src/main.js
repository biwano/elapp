// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.min.css';
import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import Elapp from 'elapp';
import createStore from '@/store/store';
import router from './routes';
import config from './config';

// loads the Icon plugin
UIkit.use(Icons);

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(Elapp, config);
const store = createStore();

Vue.filter('formatDate', value => (value ? moment(String(value)).format('DD MMM YYYY hh:mm') : undefined));
// Injecting mixins

// Importing components globally
Vue.component('suggestion', Elapp.Components.Suggestion);
Vue.component('icon', Elapp.Components.Icon);
Vue.component('boolean-radio', Elapp.Components.BooleanRadio);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  //  components: { Loader },
  template: '<app/></app>',
  mixins: [Elapp.Mixins.ComponentMixin],
  created() {
    this.loadComponent('app');
  },
});

export default Elapp;
