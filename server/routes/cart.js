import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// get or create cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
      await cart.populate('items.product');
    }
    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    res.json({ ...cart.toObject(), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// add to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Basic validation
    if (!productId || !quantity) return res.status(400).json({ msg: 'Missing productId or quantity' });
    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ msg: 'Quantity must be at least 1' });
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');
    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    res.json({ ...cart.toObject(), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// remove from cart
router.post('/remove', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) return res.status(400).json({ msg: 'Missing productId' });
    
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');
    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    res.json({ ...cart.toObject(), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// checkout (mark all items as bought by user)
router.post('/checkout', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ msg: 'Cart is empty' });

    // mark each product as bought by this user
    for (const item of cart.items) {
      const product = item.product;
      if (!product.buyer) {
        product.buyer = req.userId;
        await product.save();
      }
    }

    // clear cart
    cart.items = [];
    await cart.save();

    res.json({ msg: 'Checkout successful', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// update quantity
router.post('/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || quantity === undefined) return res.status(400).json({ msg: 'Missing required fields' });
    if (!Number.isInteger(quantity) || quantity < 0) return res.status(400).json({ msg: 'Quantity must be >= 0' });
    
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ msg: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');
    const total = cart.items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
    res.json({ ...cart.toObject(), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
