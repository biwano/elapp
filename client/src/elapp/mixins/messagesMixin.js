export default {
  created() {
    this.clearMessages();
  },
  methods: {
    clearMessages() {
      this.$store.commit('message/clear');
    },
    displayMessage(type, text) {
      this.$store.commit('message/message', { type, text });
    },
    displayInfo(text) {
      this.displayMessage('info', text);
    },
    displayError(text) {
      this.displayMessage('error', `error_${text}`);
    },
    messagePromiseCatcher(promise) {
      promise.catch((data) => {
        let message = data.message;
        if (data.payload !== undefined && data.payload.name === 'VersionError') {
          message = 'error_concurrent_writes';
        }
        this.displayError(message);
      });
      return promise;
    },
  },
};
