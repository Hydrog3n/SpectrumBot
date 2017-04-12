var express = require('express');
var Waterline = require('waterline');
var async    =  require('async');
var Pente   = require('../libs/pente.js');
var Libs   = require('../libs/libs.js');
var libs = new Libs();

let models = require('../models');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.status(200).json({
        'data' : { 
            'msg': 'Bg'
        }
    });
});

router.get('/connect/:groupname', function(req, res, next) {
    var game = null;
    var player = null;
    models.collections.game.find(function(err, result) {
        if (result.length > 0) {
            async.forEach(result, function(game, next) {
                if (game.finpartie == false && game.player.length == 1) {
                    models.collections.player.create({ "name": req.params.groupname, "numerojoueur": 2}, function(err, model) {
                        if (err) {res.status(503).json(err)}
                        player = {
                            "nomJoueur": req.params.groupname,
                            "idjoueur": model.id,
                            "numerojoueur": model.numerojoueur,
                            "code": 200
                        };
                        game.player.push(model);
                        models.collections.game.update({id : game.id}, {"player": game.player}, function(err, updatedGame)  {
                            res.status(200).json(player);
                        });
                    });
                } else {
                    next();
                }
            }, function(err) {
                if (err) return res.status(503).json(err);
                models.collections.player.create({ "name": req.params.groupname, "numerojoueur": 1}, function(err, model) {
                    if (err) {res.status(503).json(err)}
                    player = {
                        "nomJoueur": req.params.groupname,
                        "idjoueur": model.id,
                        "numerojoueur": model.numerojoueur,
                        "code": 200
                    };
                    var newgame = {
                        "finpartie": false,
                        "tableau": genTableau(),
                        "player": [model]
                    }
                    models.collections.game.create(newgame, function(err, model){
                        if (err) return res.status(503).json(err);
                        res.status(200).json(player);
                    });
                });
            });
        } else {
            models.collections.player.create({ "name": req.params.groupname, "numerojoueur": 1}, function(err, model) {
                if (err) {res.status(503).json(err)}
                player = {
                    "nomJoueur": req.params.groupname,
                    "idjoueur": model.id,
                    "numerojoueur": model.numerojoueur,
                    "code": 200
                };
                var newgame = {
                    "finpartie": false,
                    "tableau": genTableau(),
                    "player": [model]
                }
                models.collections.game.create(newgame, function(err, model){
                    if (err) return res.status(503).json(err);
                    
                    res.status(200).json(player);
                });
            }); 
        }
    });
});

router.get('/turn/:idplayer', function(req, res, next) {
    models.collections.game.find({finpartie : false}, function(err, games) {
        async.each(games,function(game, next) {
            async.each(game.player, function(player, next) {
                if (player.id == req.params.idplayer) {
                    var status = 0;
                    if (game.playerturn == player.numerojoueur ) {
                        status = 1;
                    }
                    var result = {
                        "status": status,
                        "tableau": game.tableau,
                        "nbTenaillesJ1": game.player[0].nbtenaille,
                        "nbTenaillesJ2": (game.player[1] ? game.player[1].nbtenaille : 0),
                        "dernierCoupX": game.derniercoupx,
                        "dernierCoupY": game.derniercoupy, 
                        "prolongation": game.prolongation,
                        "finPartie": game.finpartie,
                        "detailFinPartie": game.detailfinpartie,
                        "numTour": game.numtour,
                        "code": 200
                    }
                    res.status(200).json(result);
                } else {
                    next();
                }
            }, next);
        }, function() {
            res.sendStatus(404);
        });
    });
});

router.get('/play/:x/:y/:idplayer', function(req, res, next) {
    var turn = {
        "vertical" : req.params.x,
        "horizontal": req.params.y,
    }

    models.collections.game.find({finpartie : false}, function(err, games) {
        async.each(games,function(game, next) {
            async.each(game.player, function(player, next) {
                if (player.id == req.params.idplayer && game.playerturn == player.numerojoueur) {
                    var started = false
                    if (player.id == game.playerstart.id) {
                        started = true
                    }
                    var pente = new Pente(game.tableau, game.numtour, player, started);
                    
                    if (pente.autorise(turn.horizontal,turn.vertical)) {
                        game.tableau[turn.horizontal][turn.vertical] = pente.coup(turn.horizontal,turn.vertical);
                        game.derniercoupx = turn.horizontal;
                        game.derniercoupy = turn.vertical;
                        game.playerturn = (player.numerojoueur == 1 ? 2 : 1);
                        var response = pente.tenaille(turn.horizontal,turn.vertical);
                        if (response.tenaille) {
                            player.nbtenaille++;
                        }

                        //game.player[player.numerojoueur-1] = player; 
                        models.collections.game.update({id : game.id}, game).exec(function(err, game) {
                            models.collections.player.update({id : player.id}, player).exec(function(err, player) {
                                turn.game = game;
                                turn.player = player;
                                models.collections.turn.create(turn, function(err, turn) { 
                                    console.log(turn);
                                    res.status(200).json({"code": 200});
                                });
                            })
                        });
                        
                    } else {
                        console.log('not authorize');
                        res.status(406).json({"code": 406});
                    }
                } else {
                    next();
                }
            }, next);
        }, function() {
            console.log('not found');
            res.status(406).json({"code": 406});
        });
    });
});

router.get('/start/:idpartie', function(req, res, next) {
    libs.start(req.params.idpartie, res);
});

router.get('/info/:idpartie', function(req, res, next) {
    libs.info(req.params.idpartie, res);
});

genTableau = function() {
    tableau = Array();
    for (i = 0; i <= 18; i++) {
        tableau.push(Array());
        for(j= 0; j<= 18; j++) {
            tableau[i].push(0);
        }
    }
    return tableau;
};
module.exports = router;