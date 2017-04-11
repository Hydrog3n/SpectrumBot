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
                    models.collections.player.create({ "name": req.params.groupname}, function(err, model) {
                        if (err) {res.status(503).json(err)}
                        player = {
                            "nomJoueur": req.params.groupname,
                            "idjoueur": model.id,
                            "code": 200
                        };
                        game.player.push(model);
                        models.collections.game.update({id : game.id}, {"player": game.player}, function(err, updatedGame)  {
                            res.status(200).json(player);
                        });
                    });
                }
                next()
            }, function(err) {
                if (err) return res.status(503).json(err);
                models.collections.player.create({ "name": req.params.groupname}, function(err, model) {
                    if (err) {res.status(503).json(err)}
                    player = {
                        "nomJoueur": req.params.groupname,
                        "idjoueur": model.id,
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
            models.collections.player.create({ "name": req.params.groupname}, function(err, model) {
                if (err) {res.status(503).json(err)}
                player = {
                    "nomJoueur": req.params.groupname,
                    "idjoueur": model.id,
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

router.post('/turn/:idplayer', function(req, res, next) {
    models.collections.player.findOne({where : {id: req.params.id}}, function(err, result) {
        console.log(result);
    });


});
module.exports = router;