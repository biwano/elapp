<template>
  <div>
    <div v-for="message in messages" :key="message.id"
      :class="computeClass(message.type)" uk-alert>
        {{ L.$(message.text) }}
        <a :ref="`close${message.id}`" @click="remove(message)" class="icon"></a>
      </div>
  </div >
</template>

<script>
import UIkit from 'uikit';

export default {
  name: 'Messages',
  props: ['messages'],
  watch: {
    messages(messages) {
      this.makeIcons(messages);
    },
  },
  methods: {
    computeClass(type) {
      const uktype = { error: 'danger',
        info: 'primary' }[type];
      return `uk-alert-${uktype}`;
    },
    remove(message) {
      this.$store.commit('message/remove', message.id);
    },
    makeIcons() {
      this.$nextTick(() => {
        for (let i = 0; i < this.messages.length; i += 1) {
          const message = this.messages[i];
          UIkit.icon(this.$refs[`close${message.id}`], { icon: 'close' });
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon {
  float:right;
}
</style>
