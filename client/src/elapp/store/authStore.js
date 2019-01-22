// Auth store
const authStore = {
  namespaced: true,
  state: {
    user: {},
  },
  getters: {
    name: state => (state.user !== undefined ? state.user.name : ''),
    login: state => (state.user !== undefined ? state.user.login : ''),
    type: state => (state.user !== undefined ? state.user.type : ''),
    loggedIn: state => (state.user !== undefined && state.user.anonymous !== true),
  },
  mutations: {
    authenticate(state, user) {
      state.user = user;
    },
  },
};

// Mixin to be imported in Vue
export default authStore;
