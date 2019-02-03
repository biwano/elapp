module.exports = {
  name: 'documents_core',
  dependencies: ['persistence_core', 'logging_core'],
  async  init(elApp) {
  // Definition of the schema collection
    const schemaSchemaDefinition = {
      identifier: { type: 'keyword' },
      key: { type: 'list', objectsType: 'keyword' },
      fields: { type: 'object' },
      defaultAcls: { type: 'list', objectsType: 'object' },
    };
    let promise;
    // Drop default Realm
    if (elApp.getConfig('documents.dropDefaultRealm') === true) {
      promise = elApp.realmService.newRealm(elApp.realmService.defaultRealm, true);
    } else promise = Promise.resolve();
    return promise.then(() => elApp.SchemaService(['group:admin']).register({ identifier: 'schema',
      key: 'identifier',
      fields: schemaSchemaDefinition,
      defaultAcls: [] }));
  },
};
