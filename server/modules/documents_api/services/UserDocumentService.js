const getUserAcls = function getUserAcls(user) {
  return [`user:${user.login}`].concat(
    user.groups.map(group => `group:${group}`),
  );
};
const service = function service(elApp) {
  return function UserDocumentService(user) {
  	console.log(user);
    return elApp.DocumentService(getUserAcls(user), user.realm);
  };
};

module.exports = {
  name: 'UserDocumentService',
  service,
};
