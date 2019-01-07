module.exports = {
  name: 'core_groups',
  dependencies(elApp) {
    return ['core_logging', `groups_${elApp.getConfig('groups.backend', 'local')}`];
  },
};
