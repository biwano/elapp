<template>
  <div>
    <component v-bind:is="name"></component>
  </div>
</template>

<script>
import Vue from 'vue';
import ComponentMixin from '../mixins/componentMixin';
import Elapp from '../index';

export default {
  name: 'ElappComponent',
  props: ['name'],
  mixins: [ComponentMixin],
  created() {
    this.loadComponent();
  },
  methods: {
    loadComponent() {
      Vue.component(this.name, (resolve) => {
        this.getComponent(this.name).then((serverComponent) => {
          if (Array.isArray(serverComponent.mixins)) {
            for (let i = 0; i < serverComponent.mixins.length; i += 1) {
              serverComponent.mixins[i] = eval(serverComponent.mixins[i]);
            }
          }
          if (serverComponent.components !== undefined) {
            const keys = Object.keys(serverComponent.components);
            for (let i = 0; i < keys.length; i += 1) {
              serverComponent.components[keys[i]] = eval(serverComponent.components[keys[i]]);
            }
          }
          resolve(serverComponent);
        });
      });
      // const name = this.$route.params.name;
      // Vue.Component(this.$route.params.name, Schema);
    },
  },

};
</script>

