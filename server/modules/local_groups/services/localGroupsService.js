module.exports = {
  name: 'localGroupsService',
  service(elApp) {
    return {
      getGroups(login) {
        return elApp.DocumentService(['group:admin']).match({
          $schema: 'group',
          users: login,
        }).then(groups => groups.map(group => group.identifier));
      },
    };
  },
};
