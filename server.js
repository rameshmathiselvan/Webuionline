/**
 * Created by Academy on 20/10/16
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 5000;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/collegeConnect');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var cors = require('cors');
app.use(cors());

app.use(express.static('public'));

require("./server/routes.js")(app);
app.listen(port);
console.log('App is listening on port: ' + port);
console.log('Application started on ' + new Date());
console.log('http://localhost:' + port);

process.on('uncaughtException', function (err) {
    console.log(err);
    console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
});
