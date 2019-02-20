/* Module that makes persistence pluggable
 * by depending on the persistence module that does the real work
 * This module should create a persistence object in elApp that implements:
 * connect() => Connect to the database
 * registerSchema(name, fields) => Create a collection given a name and an object representing field definitions elasticearch style
 * get()
*/
module.exports = {
  name: 'persistence_core',
  dependencies(elApp) {
    return ['logging_core', `persistence_${elApp.getConfig('persistence.backend')}`, 'ui_components_file'];
  },
  init(elApp) {
    elApp.logService.trace('persistence', 'Connecting');
    return elApp.persistence.connect();
  },
  documentation: {
    description: 'Chained module that enables persistence of the documents',
    subservice_methods: [{ signature: 'connect()',
      description: 'Connect to the database',
    },
    { signature: 'deleteRealm(realm)',
      description: 'Deletes the realm \'realm\'',
    },
    { signature: 'createRealm(realm)',
      description: 'Creates the realm \'realm\'',
    },
    { signature: 'registerSchema(realm, params)',
      description: 'Registers a schema in the realm \'realm\'',
    },
    { signature: 'search(realm, query)',
      description: 'Executes the given query on the given realm',
    },
    { signature: 'get(realm, uuid)',
      description: 'get the document with the given uuid in the given realm',
    },
    { signature: 'createDocument(realm, schemaId, uuid, doc)',
      description: 'Creates the document doc with the given uuid with the given schema in the given realm',
    },
    { signature: 'updateDocument(realm, schemaId, uuid, bodyParts)',
      description: 'Updates the document with the given uuid with the given schema in the given realm using the given bodyparts',
    },

    ],
  },

};
