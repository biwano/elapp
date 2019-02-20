module.exports = {
  name: 'ui_components_file',
  dependencies: ['ui_components_core', 'assets'],
  documentation: {
    description: 'Subservice of Chained service that enables clients to fetch UI information',
    endpoints: [{ path: '/component/:core_ui_component',
      description: `This service is a chained service
It calls the 'get' method of each subservice in order
It returns the first available component information provided by the subservice`,
    }],
  },
};
