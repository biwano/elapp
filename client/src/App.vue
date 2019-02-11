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

export default {
  name: 'App',
  mixins: [Elapp.Mixins.AuthMixin, Elapp.Mixins.MessagesMixin, Elapp.Mixins.ComponentMixin],
  components: { messages: Elapp.Components.Messages },
  created() {
    this.loadComponent('nav', 'navigation');

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
