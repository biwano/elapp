export default {
  template: `
   <table class="uk-table uk-table-divider">
    <thead>
        <tr>
          <slot name="header">
            {{L.uuid}}
          </slot>
        </tr>
    </thead>
    <tbody>
        <tr v-bind:key="doc.$uuid" v-for="doc in documents">
          <slot v-bind:doc="doc">
            <td>{{ doc.uuid }} </td>
          </slot>
        </tr>
    </tbody>
</table>
  `,
  name: 'DocumentsTable',
  mixins: [Elapp.default.Mixins.DocumentMixin],
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
