var express = require('express');
var Waterline = require('waterline');
var async    =  require('async');
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
                    console.log("add player");
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
                console.log('done');
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
                        "tableau": [],
                        "player": [model]
                    }
                    models.collections.game.create(newgame, function(err, model){
                        if (err) return res.status(503).json(err);
                        res.status(200).json(player);
                    });
                });
            });
        } else {
            console.log('done');
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
                    "tableau": [],
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
    //console.log(req.params.idplayer);
    models.collections.game.find(function(err, games) {
        async.each(games,function(game, next) {
            console.log('game : '+game.id);
            async.each(game.player, function(player, next) {
                console.log('player : '+player.id);
                if (player.id == req.params.idplayer) {
                    var result = {
                        "status": game.playerturn,
                        "tableau": game.tableau,
                        "nbTenaillesJ1": game.player[0].nbtennaille,
                        "nbTenaillesJ2": game.player[1].nbtennaille,
                        "dernierCoupX": 0, //TODO
                        "dernierCoupY": 0, //TODO 
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
module.exports = router;