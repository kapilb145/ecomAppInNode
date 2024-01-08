// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart'); // Add this line
const authMiddleware = require('../middleware/auth'); // Ensure correct import


// Create a product (requires authentication)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const product = new Product({
      name,
      price,
      description,
      user: req.userId,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a product for the authenticated user
router.post('/', authMiddleware, async (req, res) => {
    try {
      const { name, price, description } = req.body;
  
      const product = new Product({
        name,
        price,
        description,
        user: req.userId, // Associate the product with the user
      });
  
      await product.save();
  
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Get all products
router.get('/',authMiddleware,async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Get products created by the authenticated user
router.get('/my-products', authMiddleware, async (req, res) => {
    try {
      const products = await Product.find({ user: req.userId });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });



  // Add a product to the user's cart
router.post('/add-to-cart/:productId', authMiddleware, async (req, res) => {
    try {
      const productId = req.params.productId;
  
      // Find the product
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Add the product to the user's cart
      const userCart = await Cart.findOne({ user: req.userId });
      userCart.products.push(product._id);
      await userCart.save();
  
      res.json({ message: 'Product added to cart successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // View products in the user's cart
router.get('/cart', authMiddleware, async (req, res) => {
    try {
      const userCart = await Cart.findOne({ user: req.userId }).populate('products');
      res.json(userCart.products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
