<template>
  <a :href="url" @click="click()">
    <span :hidden="!hot" class="hot"
        :uk-icon="`icon: ${icon}; ratio:${size}`"></span>
    <span :hidden="hot"
        :uk-icon="`icon: ${icon}; ratio:${size}`"></span>
  </a>
</template>

<script>
export default {
  name: 'Icon',
  props: { icon: String,
    size: { type: Number, default: 1 },
    url: { type: String, default: undefined },
    confirmClick: { type: Boolean, default: false },
  },
  data() {
    return {
      hot: false,
    };
  },
  created() {
  },
  methods: {
    click() {
      if (!this.confirmClick || this.hot) {
        this.$emit('click');
      } else {
        setTimeout(() => { this.hot = false; }, 2000);
        this.hot = true;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hot {
  color: #f00;
}
</style>
