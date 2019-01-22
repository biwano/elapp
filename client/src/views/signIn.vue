<template>
  <div>
    <auth v-on:authenticated="authenticated()"></auth>
  </div>
</template>

<script>
import Elapp from 'elapp';

export default {
  name: 'SignIn',
  components: { auth: Elapp.Components.LocalAuth },
  mixins: [Elapp.Mixins.NavMixin],
  methods: {
    authenticated() {
      this.navigate('home');
    },
  },
};
</script>

