// eslint-disable-next-line
ElAppRemoteComponent = {
  template: `
  <div id="app">
    <navigation />
    <messages :messages="$store.state.message.messages"></messages>
    <div>
      <router-view />
    </div>
  </div>
`,
  name: 'App',
  mixins: [Elapp.default.Mixins.AuthMixin, Elapp.default.Mixins.MessagesMixin, Elapp.default.Mixins.ComponentMixin],
  components: { messages: Elapp.default.Components.Messages },
  created() {
    this.withComponent('nav', 'navigation');
    this.messagePromiseCatcher(this.authGetUserInfo());
  },
};
