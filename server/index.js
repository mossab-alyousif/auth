var express = require('express');
var volleyball = require('volleyball');
var app = express();
app.use(volleyball);
app.get('/', function (req, res) {
    res.json({
        message: 'Hello World!'
    });
});
function notFound(req, res, next) {
    res.status(404);
    var error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}
function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}
app.use(notFound);
app.use(errorHandler);
var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log('Listening on port', port);
});
