<template>
  <div >
    <ul :ref="'tabs'" :active="activeIndex" >
      <li v-for="tab in tabs" :key="tab.id"
        @click="selectTab(tab)"  v-if="initialized">
        <a>{{ label(tab.description) }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import UIkit from 'uikit';

export default {
  name: 'Tabs',
  props: ['tabs', 'value'],
  data() {
    return { initialized: false };
  },
  methods: {
    selectTab(tab) {
      this.$emit('input', tab.id);
    },
    tabClass(tab) {
      const clazz = {
        'uk-active': tab.active,
        'uk-disabled': tab.disabled === true,
      };
      return clazz;
    },
    label(description) {
      const l = this.L[description];
      return l !== undefined ? l : description;
    },
  },
  computed: {
    activeIndex() {
      for (let i = 0; i < this.tabs.length; i += 1) {
        const tab = this.tabs[i];
        if (this.value === tab.id) {
          tab.active = true;
          const __this = this;
          this.$nextTick(() => {
            UIkit.tab(__this.$refs.tabs, { active: i });
            __this.initialized = true;
          });
          return i;
        }
        tab.active = false;
      }
      return 0;
    },
    tabActive() {
      const tabActive = {};
      for (let i = 0; i < this.tabs.length; i += 1) {
        const tab = this.tabs[i];
        tabActive[tab.id] = this.value === tab.id;
      }
      return tabActive;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
