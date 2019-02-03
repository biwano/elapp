const ElAppRemoteComponent = {
  template: `
  <div class="uk-card uk-card-default uk-card-body">
    <div class="uk-margin">
      <span class="uk-card-title">{{ L.sign_in }}</span><br/>
    </div>
    <form>
      <div class="uk-margin">
        <input class="uk-input"
        data-validation-definition="validateMinChars(login, 1)"
        type="text" :placeholder="L.login" v-model="login"
        autocomplete="username"
         @keyup.enter="signIn()"/>
      </div>
      <div class="uk-margin">
        <input class="uk-input"
        data-validation-definition="validateMinChars(password, 1)"
        type="password" :placeholder="L.password"
        autocomplete="current-password"
        v-model="password"
         @keyup.enter="signIn()"/>
      </div>
      <div class="uk-margin">
        <button :disabled="!validationStatus.valid"
          class="uk-button uk-button-primary" @click="signIn()">
          {{ L.sign_in }}
        </button>
      </div>
    </form>
  </div>  `,
  name: 'SignIn',
  mixins: [Elapp.default.Mixins.FormMixin, Elapp.default.Mixins.AuthMixin, Elapp.default.Mixins.MessagesMixin],
  data() {
    return {
      login: '',
      password: '',
    };
  },
  methods: {
    authSignIn(login, password) {
      return this.authGetUserInfo({
        headers: {
          'ELAPP-LOGIN': login,
          'ELAPP-PASSWORD': password },
      });
    },
    // Sign in
    signIn() {
      if (this.validationStatus.valid) {
        this.messagePromiseCatcher(
          this.authSignOut().then(() => {
            this.authSignIn(this.login, this.password).then((user) => {
              if (user.authService === 'localAuthenticationService') {
                this.$emit('authenticated', user);
              } else {
                this.displayError('invalid_credentials');
              }
            });
          }),
        );
      }
    },
  },
};
