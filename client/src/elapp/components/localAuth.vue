<template>
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
  </div>
</template>

<script>

import AuthMixin from '../mixins/authMixin';
import FormMixin from '../mixins/formMixin';
import MessagesMixin from '../mixins/messagesMixin';

export default {
  name: 'SignIn',
  mixins: [FormMixin, AuthMixin, MessagesMixin],
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
              if (user.authService === 'authLocalService') {
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
