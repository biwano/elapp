const service = async function service() {
  return {
    async getStore() {
      return Promise.resolve(undefined);
    },
  };
};

module.exports = {
  name: 'authCookieMemoryStoreService',
  service,
};
