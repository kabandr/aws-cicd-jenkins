const mongoose = require('mongoose');

const Product = mongoose.model('Product', {
  name: String,
  description: String,
  price: Number,
});

module.exports = Product;
