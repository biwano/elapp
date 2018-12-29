
module.exports = {
  name: 'authentication_local',
  dependencies: ['core_authentication', 'core_documents'],
  async init(elApp) {
    // Definition of the user collection
    const userSchemaDefinition = {
      login: { type: 'keyword' },
      password: { type: 'keyword' },
      apikey: { type: 'keyword' },
    };

    await elApp.documentService.registerSchema({ identifier: 'user',
      key: 'login',
      fields: userSchemaDefinition });

    // Create admin user if it does not exist
    console.log('[ AuthLocal ] Ensuring admin user');
    return elApp.documentService.createDocument('user', {
      login: 'admin',
      password: 'admin',
      apikey: '',
    });
  },


};
