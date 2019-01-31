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
    this.loadComponent();
  },
  methods: {
    loadComponent() {
      Vue.component(this.name, (resolve) => {
        this.getComponent(this.name).then(resolve);
      	/*
        setTimeout(() => {
          // Passe la définition du composant à la fonction de rappel `resolve`
          resolve({
            data() {
              return {
                count: 0,
              };
            },
            template: '<button v-on:click="count++">Vous m\'avez cliqué {{ count }} fois.</button>',
          });
        }, 1000); */
      });
      // const name = this.$route.params.name;
      // Vue.Component(this.$route.params.name, Schema);
    },
  },

};
</script>

