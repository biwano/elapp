
module.exports = {
  name: 'authentication_local',
  dependencies: ['core_authentication', 'core_documents', 'core_logging'],
  async init(elApp) {
    // Definition of the user schema
    const userSchemaDefinition = {
      login: { type: 'keyword' },
      password: { type: 'keyword' },
      apikey: { type: 'keyword' },
    };
    // Registering schema
    elApp.logService.debug('authentication', 'Registering user schema');
    await elApp.SchemaService(['group:admin']).register({ identifier: 'user',
      key: 'login',
      fields: userSchemaDefinition });

    // Registering hook to encrypt password
    elApp.registerHook('document_before_create', (doc) => {
      if (doc.$schema === 'user') {
        doc.password = elApp.localAuthenticationService.encrypt(doc.password);
      }
    }, this);
    // Create admin user if it does not exist
    elApp.logService.debug('authentication', 'Ensuring admin user');
    return elApp.DocumentService(['group:admin']).createIfAbsent('user', {
      login: 'admin',
      password: 'admin',
      apikey: '',
    });
  },


};
