var Waterline = require('waterline');

var Server = Waterline.Collection.extend({

  identity: 'server',
  connection: 'myLocalDisk',

  attributes: {
    name: {
    	type: 'string',
    	required: true,
    	unique: true
    },
    ip: {
      type: 'string',
      required: true,
      unique: true
    },
    endpoint: {
      type: 'string',
      required: true,
    }
  }
});

module.exports = Server;