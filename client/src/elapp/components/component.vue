<template>
  <div>
    <component v-bind:is="name"></component>
  </div>
</template>

<script>
import Vue from 'vue';
import ComponentMixin from '../mixins/componentMixin';

export default {
  name: 'ElappComponent',
  props: ['name'],
  mixins: [ComponentMixin],
  created() {
    Vue.component(this.name, (resolve) => {
      this.loadComponent(this.name).then(() => {
        // eslint-disable-next-line
        resolve(ElAppRemoteComponent);
      });
    });
  },
  methods: {
  },

};
</script>

