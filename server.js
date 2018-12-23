'use-strict';
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const _ = require('underscore');
const config = require('./config/get-config')
const path = require('path');
const userAuthRoute = require('./routes/user-auth')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/public/index.html')
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))

//Routes
app.use('/api/users', userAuthRoute);


//Events
io.on('connection', function(client) {

});





server.listen(config.port, function () {
  console.log('Listening on port ' + config.port)
})
