const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const pino = require('pino');
const pretty = require('pino-pretty');
const logger = pino(pretty());
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const dbURI = process.env.MONGO_URI;

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(dbURI);
    logger.info('Connected to MongoDB!');
  } catch (error) {
    logger.info('MongoDB connection error:', error);
  }
};

app.use(cors());
app.use(bodyParser.json());

// Define the Product model
const Product = mongoose.model('Product', {
  name: String,
  description: String,
  price: Number,
});

// Create a new product
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Get a single product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Update a product by ID
app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

app.listen(port, () => {
  connectToMongoDB();
  logger.info(`Server is running at http://localhost:${port}`);
});
