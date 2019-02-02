<template>
  <div>
    <component v-bind:is="name"></component>
  </div>
</template>

<script>
import Vue from 'vue';
import ComponentMixin from '../mixins/componentMixin';
// eslint-disable-next-line
import Components from '.';
import Mixins from '../mixins';

// eslint-disable-next-line
const Elapp = {
  Components,
  Mixins,
};
export default {
  name: 'ElappComponent',
  props: ['name'],
  mixins: [ComponentMixin],
  created() {
    Vue.component(this.name, (resolve) => {
      this.loadComponent(this.name).then((component) => {
        resolve(ElAppRemoteComponent);
      });
    });
  },
  methods: {
  },

};
</script>

