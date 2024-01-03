const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarritoSchema = Schema({
    producto: { type: Schema.ObjectId, ref: 'producto' },
    cantidad: { type: Number, required: true },
    precio: { type: Number, required: true },
    color: { type: String, required: true },
    selector: { type: String, required: true },
    user: { type: Schema.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('carrito', CarritoSchema);