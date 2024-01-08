// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcryptjs');


// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, password: originalPassword } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    console.log('Original Password:', originalPassword);

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(originalPassword, 10);
    console.log('Hashed Password:', hashedPassword);

    // Create a new user
    const newUser = new User({ username, password: originalPassword });
    await newUser.save();

    // Find the user by username
    const userFromDB = await User.findOne({ username });

    console.log('Stored Hashed Password:', userFromDB.password);

    // If the user doesn't exist or the password is incorrect, return unauthorized
    if (!userFromDB || !(await bcrypt.compare(originalPassword, userFromDB.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});



// User login
router.post('/login', async (req, res) => {
  // ...
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // If the user doesn't exist, or password is incorrect, return unauthorized
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, config.jwtSecret);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }


});

module.exports = router;
