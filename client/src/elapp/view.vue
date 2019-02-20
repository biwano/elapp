<template>
  <elapp-component :name="$route.params.name + 'View'"></elapp-component>
</template>

<script>
import Component from './components/component';


export default {
  name: 'ElappView',
  components: {
    'elapp-component': Component,
  },
};
</script>

