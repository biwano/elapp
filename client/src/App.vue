<template>
  <div id="app">
    <navigation />
    <messages :messages="$store.state.message.messages"></messages>
    <router-view />
  </div>
</template>

<script>
import Vuano from 'vuano';
import Nav from '@/components/nav';

export default {
  name: 'App',
  mixins: [Vuano.Mixins.AuthMixin],
  components: { navigation: Nav, messages: Vuano.Components.Messages },
  created() {
    this.messagePromiseCatcher(this.authGetUserInfo());
  },
};
</script>

<style>
#app {
}
.button-submit {
  margin-top:16px;
}
</style>
