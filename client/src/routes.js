import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/home';
import SignIn from '@/views/signIn';
import Elapp from 'elapp';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'Base', component: Home },
    { path: '/home', name: 'Home', component: Home },
    { path: '/sign_in', name: 'SignIn', component: SignIn },
  ].concat(Elapp.Routes),
});
