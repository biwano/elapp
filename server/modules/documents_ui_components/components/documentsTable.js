// eslint-disable-next-line
ElAppRemoteComponent = {
  name: 'DocumentsTable',
  template: `
 <table class="uk-table uk-table-divider">
    <thead>
        <tr>
          <slot name="header">
            {{L.uuid}}
          </slot>
        </tr>
    </thead>
    <tbody>
        <tr v-bind:key="doc.$uuid" v-for="doc in documents">
          <slot v-bind:doc="doc">
            <td>{{ doc.uuid }} </td>
          </slot>
        </tr>
    </tbody>
</table>
`,
  mixins: [Elapp.default.Mixins.DocumentMixin],
  props: ['filter', 'columns'],
  data() {
    return {
      documents: [],
    };
  },
  watch: {
    filter() {
      this.load();
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      if (typeof this.filter !== 'undefined') {
        const promise = this.search(this.filter);
        promise.then((documents) => {
          this.documents = documents;
          this.$emit('loaded', documents);
        });
      }
    },
  },
};
