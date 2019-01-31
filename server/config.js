module.exports = {
  log: { level: 'info',
    persistence: { level: 'trace' },
    moduleloader: { level: 'trace' },
    authentication: { level: 'info' },
    authorization: { level: 'trace' },
    groups: { level: 'trace' },
    documents: { level: 'trace' },
    uiComponents: { level: 'trace' },
  },
  persistence: {
    backend: 'elasticsearch',
    host: 'localhost:9200',
    log: 'debug',
  },
  documents: {
    dropDefaultRealm: false,
    defaultRealm: 'dev',
  },
  groups: {
    chain: [{ method: 'local' }],
  },
  authentication: {
    chain: [
      { method: 'local' },
      { method: 'cookie',
        secret: 'the cookie key',
        store: 'file',
        storeOptions: {
          path: '/tmp/sessions',
        } },
      { method: 'anonymous',
        login: 'anonymous',
        realm: 'dev',
      },
    ],
    local: { encryptionkey: 'the key' },
  },
  uiComponents: {
    chain: [
      { method: 'file' },
    ],
  },
};
