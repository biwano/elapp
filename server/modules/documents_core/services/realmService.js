
const service = function service(elApp) {
  return {
    defaultRealm: elApp.getConfig('documents.defaultRealm', 'elapp'),
    defaultAcls: elApp.getConfig('documents.defaultAcls', [{ 'group:admin': 'write' }]),
    deleteRealm(realm) {
      elApp.logService.trace('documents', `Deleting realm ${realm}`);
      return elApp.persistence.deleteRealm(realm);
    },
    createRealm(realm) {
      elApp.logService.trace('documents', `Creating realm ${realm}`);
      return elApp.persistence.createRealm(realm);
    },
    newRealm(realm, drop) {
      let promise;
      if (drop === true) promise = this.deleteRealm(realm);
      else promise = Promise.resolve();
      return promise.then(() => this.createRealm(realm));
    },
  };
};

module.exports = {
  name: 'realmService',
  service,
};
