var Waterline = require('waterline');

var Game = Waterline.Collection.extend({

  identity: 'game',
  connection: 'myLocalDisk',

  attributes: {
    tableau: {
      type: "array",
      defaultsTo: []
    },
    finpartie: {
      type: "boolean",
      defaultsTo: false,
    },
    numtour : {
      type: "integer",
      defaultsTo: 0
    },
    detailfinpartie: {
      type: "string",
      defaultsTo: ""
    },
    derniercoupx : {
      type: 'integer',
      defaultsTo: null // 0 pas de coup, > 0 position
    },
    derniercoupy : {
      type: 'integer',
      defaultsTo: null // 0 pas de coup, > 0 position
    },
    playerturn: {
      type: "integer",
      defaultsTo: 0 // 0 en attente, 1 au joueur 1, 2 pour le joueur 2. 
    },
    startat: {
      type: "datetime",
      defaultsTo: "0"
    },
    playerstart: {
      model: "player",
    },
    prolongation: {
      type: "boolean",
      defaultsTo: false,
    },
    players: {
      collection: "player",
      via: "games"
    },
    toJSON: function() {
     var obj = this.toObject();
     return obj;
    }
  }
});

module.exports = Game;