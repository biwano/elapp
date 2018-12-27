module.exports = {
  persistence: {
    backend: 'elasticsearch',
    host: 'localhost:9200',
    log: 'trace',
  },
  authentication: {
    chain: [
      { method: 'anonymous',
        login: 'guest',
      },
    ],
  },
};
