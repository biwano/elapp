<template>
  <div id="app">
    <navigation />
    <messages :messages="$store.state.message.messages"></messages>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import Elapp from 'elapp';
import Nav from '@/components/nav';

export default {
  name: 'App',
  mixins: [Elapp.Mixins.AuthMixin, Elapp.Mixins.MessagesMixin],
  components: { navigation: Nav, messages: Elapp.Components.Messages },
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
