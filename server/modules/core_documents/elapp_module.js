module.exports = {
  name: 'core_documents',
  dependencies: ['core_persistence', 'core_logging'],
  async  init(elApp) {
  // Definition of the schema collection
    const schemaSchemaDefinition = {
      identifier: { type: 'keyword' },
      key: { type: 'list', objectsType: 'keyword' },
      fields: { type: 'object' },
    };
    return elApp.schemaService.register({ identifier: 'schema',
      key: 'identifier',
      fields: schemaSchemaDefinition });
  },
};
