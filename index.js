// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose.connect(config.mongoURI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Include route files
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

// Use auth routes
app.use('/auth', authRoutes);

// Use product routes with authentication middleware
app.use('/products', authMiddleware, productRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
