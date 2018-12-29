module.exports = {
  persistence: {
    backend: 'elasticsearch',
    host: 'localhost:9200',
    log: 'info',
  },
  authentication: {
    chain: [
      { method: 'local' },
      { method: 'anonymous',
        login: 'anonymous',
      },
    ],
  },
};
