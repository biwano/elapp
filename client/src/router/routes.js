import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/home';
import SignIn from '@/views/signIn';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'Base', component: Home },
    { path: '/home', name: 'Home', component: Home },
    { path: '/sign_in', name: 'Home', component: SignIn },
  ],
});
