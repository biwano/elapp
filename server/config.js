module.exports = {
  persistence: {
    backend: 'elasticsearch',
    host: 'localhost:9200',
    log: 'info',
    drop: false,
  },
  groups: {
    backend: 'local',
  },
  log: { level: 'info',
    persistence: { level: 'debug' },
    moduleloader: { level: 'debug' },
    authentication: { level: 'trace' },
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
};
