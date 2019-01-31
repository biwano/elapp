module.exports = {
  name: 'schemas',
  template: '<documents-table :filter="filter" :columns="columns"></documents-table>',
  mixins: ['Elapp.Mixins.DocumentMixin'],
  components: { 'documents-table': 'Elapp.Components.DocumentsTable' },
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
