
module.exports = function init(elApp) {
  elApp.persistence.setCollection('schema', {
    identifier: { type: 'keyword' },
    definition: { type: 'object' },
  });
};

