<template>
 <table class="uk-table">
    <caption></caption>
    <thead>
        <tr>
            <th></th>
        </tr>
    </thead>
    <tfoot>
        <tr>
            <td></td>
        </tr>
    </tfoot>
    <tbody>
        <tr v-bind:key="doc.id" v-for="doc in documents">
            <td>{{ doc }} </td>
        </tr>
    </tbody>
</table>
</template>

<script>

// import AuthMixin from '../mixins/authMixin';
// import FormMixin from '../mixins/formMixin';
// import MessagesMixin from '../mixins/messagesMixin';
import DocumentsMixin from '../mixins/documentsMixin';

export default {
  name: 'DocumentsTable',
  mixins: [DocumentsMixin],
  data() {
    return {
      columns: [],
      documents: [],
      query: {},
    };
  },
  created() {
    this.search(this.query).then((documents) => { this.documents = documents; });
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
