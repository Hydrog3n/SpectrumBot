var models = require('../models');
var Pente = require('./pente.js');

var Libs = function() {

};

Libs.prototype.start = function(idPartie, res) {
    models.collections.game.findOne({where : {id : idPartie}}, function(err, game) {
        if (err) return res.status(503).json(err);
        if (!game) {
            return res.sendStatus(404);
        }
        if (game.player.length != 2) {
            return res.status(503).json({"msg" : "missing player"});
        }
        if (game.numtour > 0) {
            return res.status(503).json({"msg": "already in game"});
        }
        if (!game.finpartie && game.playerstart == undefined) {
           var numPlayerStart = Math.floor((Math.random() * 2) + 1);
           game.playerstart = game.player[numPlayerStart - 1];
           var pente = new Pente(game.tableau, game.numtour, game.player[numPlayerStart - 1], true);
           game.tableau[9][9] = pente.coup(9, 9);
           game.playerturn = numPlayerStart == 1 ? 2 : 1;
           game.numtour++;
           game.startat = new Date();
           models.collections.game.update({id : game.id}, game, function(err, newgame) {
            if (err) return res.status(503).json(err);
            var turn = {
                "vertical" : 9,
                "horizontal" : 9,
                "player" : game.playerstart,
                "game" : game
            }
            models.collections.turn.create(turn, function(err, turn) {
                res.status(200).json({"msg" : "game started"});
            });
           });
        } else {
            res.sendStatus(401);
        }
    });
};

Libs.prototype.info = function(idPartie, res) {
    models.collections.game.findOne({where : {id : idPartie}}, function(err, game) {
        if (err) return res.status(503).json(err);
        if (!game) return res.sendStatus(404);
        res.status(200).json(game);
    });
};

Libs.prototype.parties = function(res) {
    models.collections.game.find(function(err, result) {
        res.status(200).json(result);
    })
};


module.exports = Libs;