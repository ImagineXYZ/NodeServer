/**
* @descripción Módulos, archivos y servicios REST usados por el servidor
* @autor Adrián Sánchez <contact@imaginexyz.com>
*/


var mqtt = require('mqtt'), url = require('url');
// Parse
var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883');
var auth = (mqtt_url.auth || ':').split(':');
var lastOne = {};

// Create a client connection
var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
  username: auth[0],
  password: auth[1]
});

client.on('connect', function() { // When connected

  // subscribe to a topic
  client.subscribe('imaginexyz/world', function() {
    // when a message arrives, do something with it
    client.on('message', function(topic, message, packet) {
    	lastOne['topic'] = topic;
    	lastOne['message'] = message;
    	lastOne['packet'] = packet;
    	lastOne['all'] = "Received '" + message + "' on '" + topic + "'";
      	console.log("Received '" + message + "' on '" + topic + "'");
    });
  });

  // publish a message to a topic
  client.publish('imaginexyz/world', 'my message', function() {
    console.log("Message is published");
    client.end(); // Close the connection when published
  });
});

/**
* @descripción Módulos, archivos y servicios REST usados por el servidor
* @autor Adrián Sánchez <contact@imaginexyz.com>
*/

//Módulos Necesitados
var express = require('express'), //Biblioteca para permitir servicios REST
    cookieParser = require('cookie-parser'), 
    bodyParser = require('body-parser'); //Biblioteca para manejar los datos de las solicitudes

//REST APIS
var  database = require('./services/database'); //Archivo donde vamos a comunicarnos con la base de datos

var app = express(); //Instancia de express
app.use(express.logger('dev')); //Método de ver los mensajes en consola
app.use(bodyParser());

app.use(express.static(__dirname + '/webpage')); //Página por defecto al ingresar al servidor
app.use('/imaginexyz', express.static(__dirname + '/graphs')); //Página para vizualizar los datos

//Servicios REST permitidos
app.get('/imaginexyz/genuinoday', database.getData);  //GET
app.post('/imaginexyz/genuinodayb', database.newDataBody); //POST Body
app.post('/imaginexyz/genuinodayq', database.newDataQuery); //POST Query
app.put('/imaginexyz/genuinoday', database.editData); //PUT
app.delete('/imaginexyz/genuinoday', database.removeData); //DELETE

app.get('/imaginexyz/graphs', database.getInfo);
app.get('/imaginexyz/posts', database.getPosts);


app.get('/mqtt/url', function (req, res) {
    res.send(mqtt_url, 200);
});

app.get('/mqtt/message', function (req, res) {
    res.send(lastOne, 200);
});

//Redirección por defecto
app.get('*', function (req, res) {
    res.redirect('../#home', 404);
});

//Habilitar puerto de escucha para el servidor
var port = Number(process.env.PORT || 3000);
app.listen(port);
console.log('Listening on port ' + port + '...');
