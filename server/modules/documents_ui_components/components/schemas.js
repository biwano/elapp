const ElAppRemoteComponent = {
  name: 'schemas',
  template: `
  <div>
  <h4 class="uk-heading-bullet">Schemas</h4>
  <documents-table :filter="filter" :columns="columns">
    <template slot="header" slot-scope="slotProps">
     <th>{{ L.identifier }}</th>
    </template>
    <template slot-scope="slotProps">
     <td>{{slotProps.doc.identifier}}</td>
    </template>
  </documents-table>
  </div>`,
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
