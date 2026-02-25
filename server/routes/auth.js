import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// basic validation helper
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Basic validation
    if (!email || !password || !name) return res.status(400).json({ msg: 'Missing required fields' });
    if (!isValidEmail(email)) return res.status(400).json({ msg: 'Invalid email format' });
    if (password.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already in use' });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// change password (auth)
router.post('/change-password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'New password must be at least 6 characters' });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }
    
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Verify old password
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ msg: 'Current password is incorrect' });
    
    // Prevent same password
    const sameAsOld = await bcrypt.compare(newPassword, user.password);
    if (sameAsOld) return res.status(400).json({ msg: 'New password must be different from current password' });
    
    // Hash and update
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    
    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err.message);
    return res.status(500).json({ msg: 'Server error: ' + (err.message || 'unknown error') });
  }
});

// delete account (auth)
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) return res.status(400).json({ msg: 'Password is required for account deletion' });
    
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Verify password before deletion
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Password is incorrect' });
    
    // Delete all user's products
    await Product.deleteMany({ seller: req.userId });
    
    // Delete user
    await User.findByIdAndDelete(req.userId);
    
    res.json({ msg: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err.message);
    return res.status(500).json({ msg: 'Server error: ' + (err.message || 'unknown error') });
  }
});

export default router;
