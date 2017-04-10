var express = require('express');
var Waterline = require('waterline');
let models = require('../models');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.status(200).json({
        'data' : { 
            'msg': 'Bg'
        }
    });
});

router.post('/setup', function(req, res, next) {
    var body = req.body;
    //console.log(body.data);
    if (body.data === undefined) {
        res.status(401).json({ 
            'data' : { 
                'error': 'nothing send'
            }
        });
    }    
    models.collections.server.findOne({where: { ip: body.data.ip }}).exec(function(err, result) {
        if (err) { res.status(401).json(err)}
        if (result == undefined) {
            console.log(req.body.data);
            models.collections.server.create(req.body.data, function(err, model) {
                if (err) {res.status(401).json(err)}
                res.status(201).json(model);
            });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;