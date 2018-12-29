<template>
    <div class="uk-child-width-1-3@m uk-grid-small uk-grid-match" uk-grid>
      <div>
          <div class="uk-card uk-card-default uk-card-body">
              <h3 class="uk-card-title">{{ L.new_game }}</h3>
          </div>
          <div class="uk-card uk-card-default uk-card-body">
              <h3 class="uk-card-title">{{ L.new_tournament }}</h3>
          </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uk-card {
  text-align: center;
}
</style>
