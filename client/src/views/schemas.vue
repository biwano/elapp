<template>
      <documents-table :filter="filter"></documents-table>
</template>

<script>
import Elapp from 'elapp';

export default {
  name: 'Home',
  mixins: [Elapp.Mixins.DocumentMixin],
  components: { 'documents-table': Elapp.Components.DocumentsTable },
  data() {
    return {
      filter: {},
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
