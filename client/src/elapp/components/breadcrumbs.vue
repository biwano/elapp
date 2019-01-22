<template>
    <ul class="uk-breadcrumb">
      <li v-for="item in items" :key="item.description">
        <span v-if="item.active">{{ label(item.description) }}</span>
        <a v-else @click="navigate(item)">{{ label(item.description) }}</a>
      </li>
    </ul>
</template>

<script>

export default {
  name: 'Breadcrumbs',
  props: ['items'],
  methods: {
    navigate(item) {
      this.$router.push(item);
    },
    label(description) {
      const l = this.L[description];
      return l !== undefined ? l : description;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
