module.exports = {
  name: 'groups_local',
  dependencies: 'core_documents',
  async init(elApp) {
    // Definition of the groups collection
    const groupSchemaDefinition = {
      identifier: { type: 'keyword' },
      description: { type: 'text' },
      users: { type: 'list', objectsType: 'keyword' },
    };

    elApp.logService.debug('authentication', 'Registering group schema');
    await elApp.SchemaService(['group:admin']).register({ identifier: 'group',
      key: 'identifier',
      fields: groupSchemaDefinition });

    // Create admin gorup if it does not exist
    elApp.logService.debug('authentication', 'Ensuring admin group');
    return elApp.DocumentService(['group:admin']).create('group', {
      identifier: 'admin',
      description: 'Administrators',
      users: ['admin'],
    });
  },

};
