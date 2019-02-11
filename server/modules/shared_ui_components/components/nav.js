// eslint-disable-next-line
ElAppRemoteComponent = {
  template: `
  <div uk-sticky="sel-target: .uk-navbar-container;
  cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">

    <nav class="uk-navbar-container" uk-navbar>
      <div class="uk-navbar-left">

          <ul class="uk-navbar-nav">
              <li :class="classActive('/home')">
                <icon url="#/view/home" icon="home" :size="1"></icon>
              </li>
          </ul>
        <ul class="uk-navbar-nav">
            <li><a href="#/home">{{ L.bluejong }}</a></li>
        </ul>

      </div>
      <div class="uk-navbar-center">

      </div>
      <div class="uk-navbar-right">
          <ul class="uk-navbar-nav">
              <li :hidden="loggedIn" :class="classActive('/sign_in')">
                <a href="#/view/localAuthView">{{ L.sign_in }}</a></li>
              <li :hidden="!loggedIn">
                <icon url="#/view/profile" icon="user" :size="1"></icon>
              </li>
              <li>
                <icon icon="menu" :size="1"></icon>
                <div class="uk-navbar-dropdown">
                    <ul class="uk-nav uk-navbar-dropdown-nav">
                      <li class="uk-nav-muted" style="white-space: nowrap">
                        <a href="#/view/profile">{{ userLogin }}</a>
                        <span :hidden="loggedIn">{{userName}}</span>
                        <icon :hidden="!loggedIn" @click="signOut()"
                              icon="sign-out" :size="1"></icon>
                      </li>
                      <li class="uk-nav-divider"></li>
                      <li class="uk-nav-muted">
                        <a href="#/view/schemas">{{ L.schemas }}</a>
                     </li>
                      <li class="uk-nav-muted">{{ $store.state.version }}</li>
                    </ul>
                </div>
              </li>
          </ul>
      </div>
    </nav>
  </div>
`,
  name: 'Nav',
  mixins: [Elapp.default.Mixins.AuthMixin, Elapp.default.Mixins.NavMixin],
  data() {
    return {
    };
  },
  methods: {
    signOut() {
      this.messagePromiseCatcher(this.authSignOut().then(() => {
        this.authGetUserInfo();
        this.navigate({ name: 'Home' });
      }));
    },
  },
  computed: {
    name() {
      return this.userType === 'guest' ? this.L.guest : this.userName;
    },
  },
};
