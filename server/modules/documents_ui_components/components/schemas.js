let Elapp;

const ElAppRemoteComponent = {
  name: 'schemas',
  template: `<documents-table :filter="filter" :columns="columns">
  ezae
    <template slot-scope="slotProps">
      <td>{{slotProps.doc.identifier}}</td>
    </template>
  </documents-table>`,
  mixins: [Elapp.default.Mixins.DocumentMixin],
  components: { 'documents-table': Elapp.default.Components.DocumentsTable },
  data() {
    return {
      filter: {},
      columns: [],
    };
  },
  created() {
    this.filter = this.matchQuery({ $schema: 'schema' }).filter;
  },
  methods: {
  },
};
