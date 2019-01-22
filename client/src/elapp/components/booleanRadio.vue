<template>
  <span>
    <label><input class="uk-radio" :name="_uid" type="radio" value="false"
      :checked="value === false"
      @input="$emit('input', false)">{{ L.no }}</label>
    <label><input class="uk-radio" :name="_uid" type="radio" value="true"
      :checked="value === true"
      @input="$emit('input', true)">{{ L.yes }}</label>
  </span>
</template>

<script>

export default {
  name: 'BooleanRadio',
  props: ['value'],
  computed: {
    localValue() {
      return this.value ? 'true' : 'false';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
