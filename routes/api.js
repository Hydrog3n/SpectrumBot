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
                    models.collections.player.create({ "name": req.params.groupname, "numerojoueur": 2, "codeplayer": makeid()}, function(err, model) {
                        if (err) {res.status(503).json(err)}
                        player = {
                            "nomJoueur": req.params.groupname,
                            "idJoueur": model.codeplayer,
                            "numJoueur": model.numerojoueur,
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
                models.collections.player.create({ "name": req.params.groupname, "numerojoueur": 1, "codeplayer": makeid()}, function(err, model) {
                    if (err) {res.status(503).json(err)}
                    player = {
                        "nomJoueur": req.params.groupname,
                        "idJoueur": model.codeplayer,
                        "numJoueur": model.numerojoueur,
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
            models.collections.player.create({ "name": req.params.groupname, "numerojoueur": 1, "codeplayer": makeid()}, function(err, model) {
                if (err) {res.status(503).json(err)}
                player = {
                    "nomJoueur": req.params.groupname,
                    "idJoueur": model.codeplayer,
                    "numJoueur": model.numerojoueur,
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
    models.collections.game.find(function(err, games) {
        async.each(games,function(game, next) {
            async.each(game.player, function(player, next) {
                if (player.codeplayer == req.params.idplayer) {
                    models.collections.turn.find({where : {game : game.id}, sort: 'id DESC' }, function(err, result) {
                        if (result.length > 0) {                        
                            var diffturn = Math.abs(new Date(result[0].createdAt) - new Date());
                            console.log("Seconde : " + Math.floor(diffturn/1000));
                            if (Math.floor((diffturn/1000)) > 12 && game.turn > 0) {
                                game.finpartie = true;
                                if (result[0].player == game.player[0].id) {
                                    var perdant = game.player[1];
                                    var gagnant = game.player[0];
                                } else {
                                    var perdant = game.player[0];
                                    var gagnant = game.player[1];
                                }
                                
                                game.detailfinpartie = "C'est " + gagnant.name + " qui à gagné car " + perdant.name + " à mit trop de temps à joueur ! Bravo !";
                                models.collections.game.update({id : game.id}, game).exec(function(err, newgame) {
                                    var status = 0;
                                    if (newgame.playerturn == player.numerojoueur ) {
                                        status = 1;
                                    }
                                    var result = {
                                        "status": status,
                                        "tableau": newgame.tableau,
                                        "nbTenaillesJ1": newgame.player[0].nbtenaille,
                                        "nbTenaillesJ2": (newgame.player[1] ? newgame.player[1].nbtenaille : 0),
                                        "dernierCoupX": newgame.derniercoupx,
                                        "dernierCoupY": newgame.derniercoupy, 
                                        "prolongation": newgame.prolongation,
                                        "finPartie": newgame.finpartie,
                                        "detailFinPartie": newgame.detailfinpartie,
                                        "numTour": newgame.numtour,
                                        "code": 200
                                    }
                                    res.status(200).json(result);
                                });
                            } else {
                                var diff =  Math.abs(new Date(game.startat) - new Date());
                                if (Math.floor((diff/1000)/60) > 10 && game.turn > 0 && !game.prolongation) {
                                    if (game.player[0].nbtenaille == game.player[1].nbtenaille) {
                                        game.prolongation = true;
                                    } else {
                                        if (game.player[0].nbtenaille > game.player[1].nbtenaille) {
                                            game.finpartie = true;
                                            game.detailfinpartie = "C'est " + game.player[0].name + " qui à gagné car il a le plus de tenaille ! Bravo !";
                                            models.collections.game.update({id : game.id}, game).exec(function(err, newgame) {
                                                
                                            });
                                        } else {
                                            game.finpartie = true;
                                            game.detailfinpartie = "C'est " + game.player[1].name + " qui à gagné car il a le plus de tenaille ! Bravo !";
                                            models.collections.game.update({id : game.id}, game).exec(function(err, newgame) {
                                                
                                            });
                                        }
                                    }
                                }
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
                            }
                        } else {
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
                        }
                    });   
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
    if (parseInt(req.params.x) == NaN && parseInt(req.params.y) == NaN) {
        res.status(406).json({ "code": 406});
    } 
    var turn = {
        "vertical" : parseInt(req.params.x),
        "horizontal": parseInt(req.params.y),
    }

    models.collections.game.find({finpartie : false}, function(err, games) {
        async.each(games,function(game, next) {
            async.each(game.player, function(player, next) {
                if (player.codeplayer == req.params.idplayer && game.playerturn == player.numerojoueur) {
                    models.collections.turn.find({where : {game : game.id}, sort: 'id DESC' }, function(err, result) {    
                        if (result.length > 0) {
                            var diffturn = Math.abs(new Date(result[0].createdAt) - new Date());
                            console.log("Seconde : " + Math.floor(diffturn/1000));
                            if (Math.floor(diffturn/1000) > 12 && game.numtour > 0) {
                                game.finpartie = true;
                                console.log(result[0].player);
                                console.log(result[1].player);
                                if (result[0].player == game.player[0].id) {
                                    var perdant = game.player[1];
                                    var gagnant = game.player[0];
                                } else {
                                    var perdant = game.player[0];
                                    var gagnant = game.player[1];
                                }
                                game.detailfinpartie = "C'est " + gagnant.name + " qui à gagné car " + perdant.name + " à mit trop de temps à joueur ! Bravo !";
                                models.collections.game.update({id : game.id}, game).exec(function(err, newgame) {
                                    res.status(406).json({ "code": 406});
                                });
                            } else {
                                var diff =  Math.abs(new Date(game.startat) - new Date());
                                console.log("minutes : " + Math.floor((diff/1000)/60));
                                if (Math.floor((diff/1000)/60) > 10 && game.turn > 0 && !game.finpartie && !game.prolongation) {
                                    if (game.player[0].nbtenaille == game.player[1].nbtenaille) {
                                        game.prolongation = true;
                                    } else {
                                        if (game.player[0].nbtenaille > game.player[1].nbtenaille) {
                                            game.finpartie = true;
                                            game.detailfinpartie = "C'est " + game.player[0].name + " qui à gagné car il a le plus de tenaille ! Bravo !";
                                            models.collections.game.update({id : game.id}, game).exec(function(err, newgame) {
                                                res.status(406).json({ "code": 406});
                                            });
                                        } else {
                                            game.finpartie = true;
                                            game.detailfinpartie = "C'est " + game.player[1].name + " qui à gagné car il a le plus de tenaille ! Bravo !";
                                            models.collections.game.update({id : game.id}, game).exec(function(err, newgame) {
                                                res.status(406).json({ "code": 406});
                                            });
                                        }
                                    }
                                }
                                var started = false
                                
                                if (player.id == game.playerstart) {
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
                                        player.nbtenaille += response.nbtenaille;
                                        game.tableau = response.tableau;
                                    }
                                    game.numtour++;
                                // console.log('Win ? : ' + pente.win(turn.horizontal,turn.vertical));
                                    if (pente.win(turn.horizontal,turn.vertical) || player.nbtenaille == 5 || (response.tenaille && game.prolongation)) {
                                        game.finpartie = true;
                                        game.detailfinpartie = "C'est " + player.name + " qui à gagné ! Bravo !";
                                    }

                                    //game.player[player.numerojoueur-1] = player; 
                                    models.collections.game.update({id : game.id}, game).exec(function(err, newgame) {
                                        models.collections.player.update({id : player.id}, player).exec(function(err, newplayer) {
                                            turn.game = newgame[0];
                                            turn.player = newplayer[0];
                                            models.collections.turn.create(turn, function(err, turn) { 
                                                res.status(200).json({"code": 200});
                                            });
                                        })
                                    });
                                    
                                } else {
                                    console.log('not authorize');
                                    res.status(406).json({"code": 406});
                                }
                            }
                        } else {
                            res.status(406).json({"code": 406});
                        }
                    });
                    
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

router.get('/parties', function(req, res, next) {
    libs.parties(res);
});

router.get('/clearall/:code', function(req, res, next) {
    libs.clear(req.params.code, res);
})

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

makeid = function()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
module.exports = router;