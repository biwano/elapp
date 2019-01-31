<template>
      <documents-table :filter="filter" :columns="columns"></documents-table>
</template>

<script>
import Elapp from 'elapp';

export default {
  name: 'Schema',
  mixins: [Elapp.Mixins.DocumentMixin],
  components: { 'documents-table': Elapp.Components.DocumentsTable },
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uk-card {
  text-align: center;
}
</style>
