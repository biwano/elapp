<template>
  <div>
    <component v-bind:is="name"></component>
  </div>
</template>

<script>
import ComponentMixin from '../mixins/componentMixin';

export default {
  name: 'ElappComponent',
  props: ['name'],
  mixins: [ComponentMixin],
  watch: {
    name() {
      this.load();
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loadComponent(this.name);
    },
  },

};
</script>

