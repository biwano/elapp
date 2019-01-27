module.exports = {
  persistence: {
    backend: 'elasticsearch',
    host: 'localhost:9200',
    log: 'debug',
  },
  documents: {
    dropDefaltRealm: 'true',
    defaultRealm: 'elapp',
  },
  groups: {
    chain: [{ method: 'local' }],
  },
  log: { level: 'info',
    persistence: { level: 'trace' },
    moduleloader: { level: 'trace' },
    authentication: { level: 'trace' },
    authorization: { level: 'trace' },
    groups: { level: 'debug' },
    documents: { level: 'trace' },
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
      },
    ],
    local: { encryptionkey: 'the key' },
  },
  authorization: {
    chain: [
      { method: 'local' },
    ],
  },
};
