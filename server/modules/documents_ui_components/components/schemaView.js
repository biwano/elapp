// eslint-disable-next-line
ElAppRemoteComponent = {
  name: 'Schema',
  template: `
  <document :documentSchema="'schema'" :documentKey="key"></document>
  `,
  mixins: [Elapp.default.Mixins.DocumentMixin, Elapp.default.Mixins.ComponentMixin],
  data() {
    return {
      documentId: undefined,
    };
  },
  created() {
    this.withComponent('document');
  },
  computed: {
    identifier() {
      return this.$route.params.param1;
    },
    key() {
      return { identifier: this.identifier };
    },
  },
};
