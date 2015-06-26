var express = require('express');
var router = express.Router();
var productosModel = require('../models/productoSchema');
var dbname = 'mongodb://localhost/tiendaDb';
var mongoose = require('mongoose');
mongoose.connect(dbname);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log('Se conecto exitosamente');
});


//creating a new product
/*var chips = new productosSchema({
    name: 'Sabritas', 
    price: 10
});
console.log("Producto: " + chips.name + "\nPrecio: " + chips.price);
*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'La tiendita de la esquina' });
});

router.get('/todos', function(req, res, next) {
    var Producto = mongoose.model('Producto');//mongose.model() trae todo lo que contiene la db y el modelo, ('Producto') representa la db. 
    Producto.find(function (err, productos) {
        if (err) return next(err);
        res.render('registros', {productos: productos});
    });
});

router.get('/agregar', function(req, res, next) {
  res.render('agregar');
});

router.post('/agregar', function(req, res, next) {//guardar a la base de datos
    var producto = productosModel({
        name: req.body.name,
        price: parseInt(req.body.price, 10)
    });
    
    producto.save(function (err, data) {//guarda el nuevo producto en la db
        if (err) return next(err);
        res.redirect('/todos');
    });
});

router.get('/modificar/:id', function(req, res, next) {
    var Producto = mongoose.model('Producto');
    
    Producto.findById(req.params.id, function (err, producto) {
        if (err) return next(err);
        res.render('modificar', { id: producto.id, 
                                 name: producto.name, 
                                 price: producto.price});
    });
});

router.post('/modificar', function(req, res, next) {
     
    var Producto = mongoose.model('Producto');
    
    Producto.findById(req.body.id, function (err, producto) {
        if (err) return next(err);
        
        producto.name = req.body.name;
        producto.price = parseInt(req.body.price, 10);
        
        producto.save(function (err, data) {
            if (err) return next(err);
            res.redirect('/todos');
        });
        
    }); 
    
});

router.get('/eliminar/:id', function(req, res, next) {
    var Producto = mongoose.model('Producto');
    
    Producto.remove({ _id: req.params.id }, function (err) {
        if (err) return next(err);
        
        res.redirect('/todos');
    });
});

router.get('/ver/:id', function(req, res, next) {
    var Producto = mongoose.model('Producto');
    
    Producto.findById(req.params.id, function (err, producto) {
        if(err) return next(err);
        res.render('view', { producto: producto});
    });
});

router.get('/buscar', function(req, res, next) {
    res.render('buscarNombre');
});

router.post('/buscar', function(req, res, next) {
    var Producto = mongoose.model('Producto');
    Producto.find({ name: req.body.name }, function (err, productos) {
        if (err) return console.error(err);
        if (!req.body.name) return console.log("No existe");
        res.render('registros', {productos: productos});
    })
});


module.exports = router;
