<template>
 <table class="uk-table uk-table-divider">
    <thead>
        <tr>
            <th>Schema</th>
            <th>key</th>
            <th>fields</th>
        </tr>
    </thead>
    <tbody>
        <tr v-bind:key="doc.$uuid" v-for="doc in documents">
          <slot v-bind:doc="doc">
            <td>{{ doc.identifier }} </td>
            <td>{{ doc.key }} </td>
            <td>{{ doc.fields }} </td>
          </slot>
        </tr>
    </tbody>
</table>
</template>

<script>

// import AuthMixin from '../mixins/authMixin';
// import FormMixin from '../mixins/formMixin';
// import MessagesMixin from '../mixins/messagesMixin';
import DocumentMixin from '../mixins/documentMixin';

export default {
  name: 'DocumentsTable',
  mixins: [DocumentMixin],
  props: ['filter', 'columns'],
  data() {
    return {
      documents: [],
    };
  },
  created() {
    const promise = this.search(this.filter);
    promise.then((documents) => { this.documents = documents; });
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
