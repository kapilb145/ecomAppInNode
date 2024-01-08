// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
