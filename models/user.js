// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Cart = require('./cart');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },

});

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  if (!user.cart) {
    const cart = new Cart({ user: user._id });
    await cart.save();
    user.cart = cart._id;
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
