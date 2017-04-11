var Waterline = require('waterline');

var Turn = Waterline.Collection.extend({

  identity: 'turn',
  connection: 'myLocalDisk',

  attributes: {
    vertical: {
    	type: 'int',
    	required: true,
    },
    horizontal: {
    	type: 'int',
    	required: true,
    },
    game: {
      model: 'game',
      required: true,
    },
    player: {
        model: 'player',
        required: true
    }
  }
});

module.exports = Turn;