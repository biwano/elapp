// eslint-disable-next-line
ElAppRemoteComponent = {
  template: `
  <div>
    <local-auth @authenticated="authenticated()"></local-auth>
  </div>
`,
  name: 'LocalAuthView',
  mixins: [Elapp.default.Mixins.NavMixin, Elapp.default.Mixins.ComponentMixin],
  created() {
    this.withComponent('localAuth', 'local-auth');
  },
  methods: {
    authenticated() {
      this.navigate('home');
    },
  },
};

