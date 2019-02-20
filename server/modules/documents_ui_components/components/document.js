// eslint-disable-next-line
ElAppRemoteComponent = {
  name: 'Document',
  template: `
  <div>
    {{ dummy}}
    {{ this.document.$uuid }}
  </div>
  `,
  mixins: [Elapp.default.Mixins.DocumentMixin],
  props: ['documentUuid', 'documentSchema', 'documentKey'],
  data() {
    return {
      document,
    };
  },
  methods: {
    load() {
      let filter;
      if (typeof this.documentUuid !== 'undefined') {
        filter = this.matchQuery({ $uuid: this.documentUuid }).filter;
      }
      if (typeof this.documentSchema !== 'undefined') {
        const match = Object.assign({}, { $schema: this.documentSchema }, this.documentKey);
        filter = this.matchQuery(match).filter;
      }
      this.searchOne(filter).then((document) => {
        this.document = Object.assign(document);
      });
    },
  },
  computed: {
    dummy() {
      this.load();
      return this.documentUuid + this.documentSchema + this.documentKey;
    },
  },
};
