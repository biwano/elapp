module.exports = {
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
  log: { level: 'info',
    persistence: { level: 'debug' },
    moduleloader: { level: 'debug' },
    authentication: { level: 'info' },
    authorization: { level: 'trace' },
    groups: { level: 'info' },
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
        realm: 'dev',
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
