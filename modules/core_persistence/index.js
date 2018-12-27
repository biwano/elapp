module.exports = {
  name: 'core_persistence',
  dependencies(elApp) {
    return `persistence_${elApp.getConfig('persistence.backend')}`;
  },
};
