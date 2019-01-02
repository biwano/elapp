
module.exports = {
  name: 'authentication_local',
  dependencies: ['core_authentication', 'core_documents', 'core_logging'],
  async init(elApp) {
    // Definition of the user collection
    const userSchemaDefinition = {
      login: { type: 'keyword' },
      password: { type: 'keyword' },
      apikey: { type: 'keyword' },
    };

    elApp.logService.debug('authentication', 'Registering user schema');
    await elApp.schemaService.register({ identifier: 'user',
      key: 'login',
      fields: userSchemaDefinition });

    // Create admin user if it does not exist
    elApp.logService.debug('authentication', 'Ensuring admin user');
    return elApp.documentService.create('user', {
      login: 'admin',
      password: 'admin',
      apikey: '',
    });
  },


};
