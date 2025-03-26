import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Register User
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Create new user
    const newUser = new User({ name, email, phone });
    await newUser.save();

    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
