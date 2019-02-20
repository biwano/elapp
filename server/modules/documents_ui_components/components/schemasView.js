// eslint-disable-next-line
ElAppRemoteComponent = {
  name: 'Schemas',
  template: `
  <div>
  <h4 class="uk-heading-bullet">Schemas</h4>
  <documents-table :filter="filter" :columns="columns" @loaded="loaded">
    <template slot="header" slot-scope="slotProps">
     <th>{{ L.identifier }}</th>
     <th class="uk-table-shrink"></th>
    </template>
    <template slot-scope="slotProps">
     <td><a :href="'#/view/schema/' + slotProps.doc.identifier">{{slotProps.doc.identifier}}</a></td>
     <td><span class="uk-badge">{{slotProps.doc.count}}</span></td>
    </template>
  </documents-table>
  </div>`,
  mixins: [Elapp.default.Mixins.DocumentMixin, Elapp.default.Mixins.ComponentMixin],
  data() {
    return {
      filter: undefined,
      columns: [],
    };
  },
  created() {
    this.withComponent('documentsTable', 'documents-table');
    this.matchQuery({ $schema: 'schema' }).then((query) => { this.filter = query.filter; });
  },
  methods: {
    loaded(documents) {
      documents.forEach((doc, index) => {
        this.matchQuery({ $schema: doc.identifier }).then((query) => {
          this.count(query.filter).then((count) => {
            doc.count = count;
            this.$set(documents, index, doc);
          });
        });
      });
    },
  },
};
