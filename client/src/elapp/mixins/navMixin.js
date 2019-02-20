// Mixin to be imported in Vue
import MessagesMixin from './messagesMixin';

export default {
  mixins: [MessagesMixin],
  methods: {
    classActive(url) {
      const active = this.$route.path.startsWith(url);
      return { 'uk-active': active };
    },
    navigate(view) {
      this.clearMessages();
      this.$router.push(`/view/${view}`);
    },
  },
};
