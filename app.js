var express     = require('express');
var bodyParser  = require('body-parser');
var app         = express();

var routes      = require("./routes/api");

var models      = require('./models');
var connections = require('./configs/connections.js');

models.initialize(connections, function(err, models) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use("/", routes);

    app.use(function(req, res, next) {
        res.status(404);
        res.send({
            "data":{
                code: 404,
                error : 'Not Found',
            }
        });
    return;
    });
    
    app.listen(9000);

});