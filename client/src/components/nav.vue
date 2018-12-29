<template>

  <div uk-sticky="sel-target: .uk-navbar-container;
  cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">

    <nav class="uk-navbar-container" uk-navbar>
      <div class="uk-navbar-left">

          <ul class="uk-navbar-nav">
              <li :class="classActive('/home')">
                <icon url="#/home" icon="home" :size="1"></icon>
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
              <li :hidden="loggedIn" :class="classActive('/register')">
                <a href="#/registration_request">{{ L.register }}</a></li>
              <li :hidden="loggedIn" :class="classActive('/sign_in')">
                <a href="#/sign_in">{{ L.sign_in }}</a></li>
              <li :hidden="!loggedIn">
                <icon url="#/profile" icon="user" :size="1"></icon></li>
              <li>
                <icon icon="menu" :size="1"></icon>
                <div class="uk-navbar-dropdown">
                    <ul class="uk-nav uk-navbar-dropdown-nav">
                        <li class="uk-nav-muted" style="white-space: nowrap">
                          <a :hidden="!loggedIn" href="#/profile">{{ userName }}</a>
                          <span :hidden="loggedIn">{{userName}}</span>
                           <icon :hidden="!loggedIn" @click="signOut()"
                                icon="sign-out" :size="1"></icon>
                        </li>
                        <li class="uk-nav-divider"></li>
                        <li :class="classActive('/games')">
                          <a href="#/games">{{ L.my_games }}</a></li>
                        <li class="uk-nav-divider"></li>
                        <li class="uk-nav-muted">{{ L.bluejong }} {{ $store.state.version }}</li>
                    </ul>
                </div>
              </li>
          </ul>
      </div>
    </nav>
  </div>

</template>

<script>
import vuano from 'vuano';

export default {
  name: 'Nav',
  mixins: [vuano.Mixins.AuthMixin],
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
