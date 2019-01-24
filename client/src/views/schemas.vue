<template>
    <div class="uk-child-width-1-3@m uk-grid-small uk-grid-match" uk-grid>
      <documents-table :query="query"></documents-table>
  </div>
</template>

<script>
import Elapp from 'elapp';

export default {
  name: 'Home',
  components: { 'documents-table': Elapp.Components.DocumentsTable },
  data() {
    return {
      query: {},
    };
  },
  created() {
    this.query = { $schema: 'schema' };
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
