/**
* @descripción Funciones relacionadas con la base de datos
* @autor Adrián Sánchez <contact@imaginexyz.com>
*/

var mongo = require('mongodb'); //Biblioteca para comunicarse con la base de datos MongoDB

//Puerto de conexión con la base de datos (no es el mismo de escucha del servidor)
var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/Remora';


//Conexión con la base de datos
mongo.MongoClient.connect(uristring, function(err, database) {
    if(!err) {
        db = database; //Instancia de la base de datos
        console.log('Connected to the "Remora" database');
    }
    else{
        console.log(404, 'Error Connecting to the "Remora" database');
    }
});

//Función para el manejo de la zona horaria
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

/******************* RÉMORA ********************/


exports.getHeaders = function(req,res) {
    var latIn = Math.floor(parseFloat(req.body.lat) * 100) / 100,
        lonIn = Math.ceil(parseFloat(req.body.lon) * 100) / 100,
        posArray = [];
    posArray.push({id:1,lat:latIn-0.005,lon:lonIn+0.005},{id:2,lat:latIn-0.005,lon:lonIn-0.005},{id:3,lat:latIn-0.005,lon:lonIn-0.015},
                    {id:4,lat:latIn+0.005,lon:lonIn+0.005},{id:5,lat:latIn+0.005,lon:lonIn-0.005},{id:6,lat:latIn+0.005,lon:lonIn-0.015},
                    {id:7,lat:latIn+0.015,lon:lonIn+0.005},{id:8,lat:latIn+0.015,lon:lonIn-0.005},{id:9,lat:latIn+0.015,lon:lonIn-0.015});
    posArray.map(function(pos){
        pos.lat=parseFloat(pos.lat.toFixed(3));
        pos.lon=parseFloat(pos.lon.toFixed(3));
    });
    res.send(200, posArray);
    /*db.collection('Ids').findAndModify({_id:1},{},{$inc:{headers:1}},function(err, doc_ids) {
        if(err) {
            throw err;
            res.send(400, err);
        }
        else{
            db.collection('ImagineXYZ').find({}).toArray(function(error, doc){
                if(error) {
                    throw error;
                    res.send(400, error);
                }
                else{
                    res.send(200, doc);
                }
            })
        }
    });*/
}

exports.getSabana = function(req,res) {
    console.log(req.body.array);
    var latIn = 9.93,
        lonIn = -84.11,
        posArray = [];
    posArray.push({id:1,lat:latIn-0.005,lon:lonIn+0.005},{id:2,lat:latIn-0.005,lon:lonIn-0.005},{id:3,lat:latIn-0.005,lon:lonIn-0.015},
                    {id:4,lat:latIn+0.005,lon:lonIn+0.005},{id:5,lat:latIn+0.005,lon:lonIn-0.005},{id:6,lat:latIn+0.005,lon:lonIn-0.015},
                    {id:7,lat:latIn+0.015,lon:lonIn+0.005},{id:8,lat:latIn+0.015,lon:lonIn-0.005},{id:9,lat:latIn+0.015,lon:lonIn-0.015});
    posArray.map(function(pos){
        pos.lat=parseFloat(pos.lat.toFixed(3));
        pos.lon=parseFloat(pos.lon.toFixed(3));
    });
    res.send(200, posArray);
}

exports.getToday = function(req, res) {
  var now = new Date().addHours(1),
    nowString = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getUTCFullYear();
  db.collection('Positions').findOne({date:nowString}, function(err, doc) {
      if(err) {throw err;res.send(400, err);}
      else{
        res.send(200, doc);
      }
  });
}

exports.insertToday = function(req, res) {
  var pos = req.body,
    now = new Date().addHours(1),
    nowString = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getUTCFullYear();
  pos['date'] = nowString;
  db.collection('Positions').findAndModify({date:nowString},{},{$push:{pos:pos}},{upsert: true},function(err, doc) {
      if(err) {throw err;res.send(400, err);}
      else{
        res.send(200, pos);
      }
  });
}