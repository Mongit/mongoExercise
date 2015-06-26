var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var productoSchema = mongoose.Schema({
    name: String,
    price: Number
});

//compiling the schema into a model = class with which we construct documents.
var Producto = mongoose.model('Producto', productoSchema);//nombre del esquema

module.exports = function(data){
    return new Producto(data);
}