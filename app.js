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
app.post('/imaginexyz/genuinodayp', database.newData); //POST Body
app.post('/imaginexyz/genuinodayq', database.newData); //POST Query
app.put('/imaginexyz/genuinoday', database.editData); //PUT
app.delete('/imaginexyz/genuinoday', database.removeData); //DELETE

app.get('/imaginexyz/graphs', database.getInfo);
app.get('/imaginexyz/posts', database.getPosts);

//Redirección por defecto
app.get('*', function (req, res) {
    res.redirect('../#home', 404);
});

//Habilitar puerto de escucha para el servidor
var port = Number(process.env.PORT || 3000);
app.listen(port);
console.log('Listening on port ' + port + '...');
