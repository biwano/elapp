
const service = function service(elApp) {
  const logLevels = { error: 0, warning: 1, info: 2, trace: 3, debug: 4 };
  const serviceInstance = {
    write(data) {
      console.log(data);
    },
    getLogLevel(category) {
      return logLevels[this.getLogLevelName(category)];
    },
    getLogLevelName(category) {
      return elApp.getConfig(`log.${category}.level`,
        elApp.getConfig('log.level',
          'info'));
    },
    logLevelToName(level) {
      let res;
      Object.keys(logLevels).forEach((key) => {
        if (logLevels[key] === level) res = key;
      });
      return res;
    },
    // Main logging function
    log(level, category, data) {
      // Checking log level
      if (typeof data === 'undefined' || typeof category === 'undefined' || typeof level === 'undefined') {
        elApp.logService.error('logging', 'Bad call to logging function');
      }
      if (typeof data !== 'string') {
        data = JSON.stringify(data);
      }
      if (level <= this.getLogLevel(category)) {
        const date = new Date();
        const levelName = this.logLevelToName(level).toUpperCase();
        const logDestinations = elApp.getConfig(`log.${category}.destinations`,
          elApp.getConfig('log.destinations',
            ['logService']));
        logDestinations.forEach((destination) => {
          elApp[destination].write(`${date.toLocaleString()} ${category} ${levelName}: ${data}`);
        });
      }
    },
  };
  Object.keys(logLevels).forEach((level) => {
    serviceInstance[level] = function logForLevel(category, data) {
      serviceInstance.log(logLevels[level], category, data);
    };
  });
  return serviceInstance;
};

module.exports = {
  name: 'logService',
  service,
};
