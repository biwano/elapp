module.exports = {
  name: 'groups_local',
  dependencies: 'documents_core',
  async init(elApp) {
    // Definition of the groups collection
    const groupSchemaDefinition = {
      identifier: { type: 'keyword' },
      description: { type: 'text' },
      localUsers: { type: 'list', objectsType: 'keyword' },
      groups: { type: 'list', objectsType: 'keyword' },
      users: { type: 'list', objectsType: 'keyword' },
    };

    elApp.logService.debug('authentication', 'Registering group schema');
    await elApp.SchemaService(['group:admin']).register({ identifier: 'group',
      key: 'identifier',
      fields: groupSchemaDefinition });

    // Create admin gorup if it does not exist
    elApp.logService.debug('authentication', 'Ensuring admin group');
    return elApp.DocumentService(['group:admin']).createIfAbsent('group', {
      identifier: 'admin',
      description: 'Administrators',
      users: ['admin'],
    });
  },

};
