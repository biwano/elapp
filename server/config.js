module.exports = {
  persistence: {
    backend: 'elasticsearch',
    host: 'localhost:9200',
    log: 'debug',
    drop: false,
  },
  groups: {
    chain: [{ method: 'local' }],
  },
  log: { level: 'info',
    persistence: { level: 'debug' },
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
