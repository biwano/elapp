
const service = function service(elApp) {
  return {
    defaultRealm: elApp.getConfig('document.defaultRealm', 'elapp'),
    defaultAcls: elApp.getConfig('document.defaultAcls', [{ 'group:admin': 'write' }]),
    newRealm(realm, drop) {
      let promise;
      if (drop === true) promise = elApp.persistence.deleteRealm(realm);
      else promise = Promise.resolve();
      return promise.then(() => {
        elApp.persistence.createRealm(realm);
      });
    },
  };
};

module.exports = {
  name: 'realmService',
  service,
};
