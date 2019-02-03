<template>
  <div>
    <elapp-component :name="'localAuth'" v-on:authenticated="authenticated()"></elapp-component>
  </div>
</template>

<script>
import Component from 'elapp/components/component';
import Elapp from 'elapp';

export default {
  name: 'SignIn',
  components: { 'elapp-component': Component },
  mixins: [Elapp.Mixins.NavMixin],
  methods: {
    authenticated() {
      this.navigate('home');
    },
  },
};
</script>

