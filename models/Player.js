var Waterline = require('waterline');

var Player = Waterline.Collection.extend({

  identity: 'player',
  connection: 'myLocalDisk',

  attributes: {
    name: {
    	type: 'string',
    	required: true
    },
    nbtenaille: {
      type: 'integer',
      defaultsTo: 0
    },
    numerojoueur: {
      type: 'integer',
      required: true,
    },
    games : {
      model : "game",
      via: "players"
    },
    toJSON: function() {
     var obj = this.toObject();
     return obj;
    }
  }
});

module.exports = Player;