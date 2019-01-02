module.exports = {
  persistence: {
    backend: 'elasticsearch',
    host: 'localhost:9200',
    log: 'info',
  },
  log: { level: 'info',
    persistence: { level: 'info' },
    moduleloader: { level: 'debug' },
    authentication: { level: 'trace' },
  },
  authentication: {
    chain: [
      { method: 'local' },
      { method: 'cookie', secret: 'the cookie key' },
      { method: 'anonymous',
        login: 'anonymous',
      },
    ],
    local: { encryptionkey: 'the key' },
  },
};
