import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// setup multer
const uploadsDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// create product (auth)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    
    // Basic validation
    if (!title || !price) return res.status(400).json({ msg: 'Title and price are required' });
    if (isNaN(price) || price < 0) return res.status(400).json({ msg: 'Price must be a valid number >= 0' });
    
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const p = new Product({ title, description, price, image, seller: req.userId });
    await p.save();
    res.json(p);
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(500).json({ msg: 'Server error: ' + (err.message || 'Unknown error') });
  }
}, (err, req, res, next) => {
  // Multer error handler
  console.error('Upload error:', err);
  res.status(400).json({ msg: 'File upload error: ' + (err.message || 'Unknown error') });
});

// list products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'email name').populate('comments.user', 'email name').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// buy product
router.post('/:id/buy', auth, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ msg: 'Product not found' });
    if (p.buyer) return res.status(400).json({ msg: 'Already sold' });
    p.buyer = req.userId;
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) return res.status(400).json({ msg: 'Comment cannot be empty' });
    
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ msg: 'Product not found' });
    p.comments.push({ user: req.userId, text });
    await p.save();
    const populated = await Product.findById(p._id).populate('comments.user', 'email name');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
