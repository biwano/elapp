import http from '../services/http';


export default {
  computed: {
    userName() {
      return this.$store.getters['auth/name'];
    },
    userLogin() {
      return this.$store.getters['auth/login'];
    },
    userType() {
      return this.$store.getters['auth/type'];
    },
    loggedIn() {
      return this.$store.getters['auth/loggedIn'];
    },
  },
  methods: {
    authGetUserInfo(config) {
      return http.get('auth', config).then((user) => {
        this.$store.commit('auth/authenticate', user);
        return user;
      });
    },
    authSignOut() {
      return http.delete('auth', { });
    },
  },
};
