// eslint-disable-next-line
ElAppRemoteComponent = {
  name: 'Schemas',
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
  mixins: [Elapp.default.Mixins.DocumentMixin, Elapp.default.Mixins.ComponentMixin],
  data() {
    return {
      filter: {},
      columns: [],
    };
  },
  created() {
    this.loadComponent('documentsTable', 'documents-table');
    this.filter = this.matchQuery({ $schema: 'schema' }).filter;
  },
  methods: {
  },
};
