import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { FiSmartphone, FiUploadCloud, FiShoppingCart, FiCreditCard, FiMessageSquare, FiPackage, FiTrendingUp } from 'react-icons/fi';

function getToken() { return localStorage.getItem('token'); }

function UploadForm({ onUploaded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('price', price);
      if (file) fd.append('image', file);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.msg || 'Upload failed');
      setMsg('✓ Product uploaded successfully!');
      setTitle(''); setDescription(''); setPrice(''); setFile(null);
      onUploaded && onUploaded(data);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(`✗ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title"><FiSmartphone className="me-2" style={{ verticalAlign: 'middle' }} />Sell a Phone</h5>
        {msg && <Alert variant={msg.includes('✗') ? 'danger' : 'success'} onClose={() => setMsg('')} dismissible>{msg}</Alert>}
        <Form onSubmit={submit}>
          <Form.Group className="mb-2">
            <Form.Label>Title *</Form.Label>
            <Form.Control placeholder="e.g., iPhone 15 Pro Max" value={title} onChange={e=>setTitle(e.target.value)} required/>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Price ($) *</Form.Label>
            <Form.Control type="number" placeholder="999" value={price} onChange={e=>setPrice(e.target.value)} required/>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={2} placeholder="Condition, features, etc." value={description} onChange={e=>setDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
          </Form.Group>
          <Button variant="primary" disabled={loading} type="submit">
            {loading ? <><Spinner size="sm" className="me-2"/>Uploading...</> : <><FiUploadCloud className="me-2" />Upload & Sell</>}
          </Button>
        </Form>
      </div>
    </div>
  );
}

function ProductCard({ p, onBuy, onAddCart, onComment, cart }){
  const [text, setText] = useState('');
  const [buying, setBuying] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [msg, setMsg] = useState('');
  const isInCart = cart.items.some(item => item.product?._id === p._id);

  async function handleBuy() {
    setBuying(true);
    try {
      await onBuy(p._id);
      setMsg('✓ Purchase confirmed!');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('✗ Purchase failed');
    } finally {
      setBuying(false);
    }
  }

  async function handleAddCart() {
    try {
      await onAddCart(p._id, 1);
      setMsg('✓ Added to cart');
      setTimeout(() => setMsg(''), 2000);
    } catch {
      setMsg('✗ Error adding to cart');
    }
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setCommenting(true);
    try {
      await onComment(p._id, text);
      setText('');
      setMsg('✓ Comment added');
      setTimeout(() => setMsg(''), 2000);
    } catch {
      setMsg('✗ Comment failed');
    } finally {
      setCommenting(false);
    }
  }

  return (
    <div className="card mb-3 shadow-sm">
      <div className="row g-0">
        <div className="col-md-3">
          <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
            {p.image ? <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.title}/> : 
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">No image</div>}
          </div>
        </div>
        <div className="col-md-9">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h5 className="card-title mb-0">{p.title}</h5>
                <small className="text-muted">by {p.seller?.name || p.seller?.email || 'seller'}</small>
              </div>
              <div className="text-end">
                <h4 style={{ color: '#0052CC' }} className="mb-0">${p.price}</h4>
                {p.buyer && <Badge bg="secondary">SOLD</Badge>}
              </div>
            </div>
            <p className="card-text text-muted small">{p.description}</p>
            {msg && <Alert variant={msg.includes('✓') ? 'success' : 'danger'} className="py-1 px-2 small mb-2">{msg}</Alert>}
            <div className="d-flex gap-2 mb-2">
              <Button size="sm" variant="primary" onClick={handleBuy} disabled={p.buyer || buying}>
                {buying ? <><Spinner size="sm" className="me-1"/>...</> : <><FiCreditCard className="me-1" />Buy Now</>}
              </Button>
              <Button size="sm" variant="outline-primary" onClick={handleAddCart} disabled={isInCart || p.buyer}>
                {isInCart ? <>✓ In Cart</> : <><FiShoppingCart className="me-1" />Add to Cart</>}
              </Button>
            </div>
            <div className="border-top pt-2">
              <Form onSubmit={handleComment} className="d-flex gap-2">
                <Form.Control size="sm" placeholder="Leave a remark..." value={text} onChange={e=>setText(e.target.value)} disabled={commenting}/>
                <Button size="sm" variant="outline-secondary" disabled={!text.trim() || commenting} type="submit">
                  {commenting ? '...' : <FiMessageSquare />}
                </Button>
              </Form>
              {p.comments && p.comments.length > 0 && (
                <div className="mt-2">
                  {p.comments.map(c => (
                    <small key={c._id} className="d-block text-muted"><strong>{c.user?.name || c.user?.email}</strong>: {c.text}</small>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard(){
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCart, setShowCart] = useState(false);

  useEffect(()=>{ fetchAll(); }, []);
  
  async function fetchAll(){
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/cart', { headers: { Authorization: `Bearer ${getToken()}` } })
      ]);
      if (!pRes.ok) throw new Error(`Products fetch failed: ${pRes.status}`);
      if (!cRes.ok) throw new Error(`Cart fetch failed: ${cRes.status}`);
      
      const pText = await pRes.text();
      const cText = await cRes.text();
      
      const prods = pText ? JSON.parse(pText) : [];
      const cartData = cText ? JSON.parse(cText) : { items: [], total: 0 };
      
      setProducts(prods);
      setCart(cartData);
    } catch (e) {
      console.error('fetchAll error:', e);
      setProducts([]);
      setCart({ items: [], total: 0 });
    }
  }

  async function onUploaded(p){ 
    setProducts(prev=>[p, ...prev]); 
  }

  async function onBuy(id){
    try {
      const res = await fetch(`/api/products/${id}/buy`, { 
        method: 'POST', 
        headers: { Authorization: `Bearer ${getToken()}` } 
      });
      if (!res.ok) {
        const text = await res.text();
        const errData = text ? JSON.parse(text) : { msg: 'Buy failed' };
        throw new Error(errData.msg || 'Buy failed');
      }
      fetchAll();
    } catch (err) {
      alert(`Error: ${err.message}`);
      throw err;
    }
  }

  async function onAddCart(id, qty){
    const res = await fetch(`/api/cart/add`, { 
      method: 'POST', 
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${getToken()}` }, 
      body: JSON.stringify({ productId: id, quantity: qty }) 
    });
    if (!res.ok) {
      const text = await res.text();
      const errData = text ? JSON.parse(text) : { msg: 'Add to cart failed' };
      throw new Error(errData.msg || 'Add to cart failed');
    }
    const text = await res.text();
    const cartData = text ? JSON.parse(text) : { items: [], total: 0 };
    setCart(cartData);
  }

  async function onComment(id, text){
    if (!text) return;
    const res = await fetch(`/api/products/${id}/comment`, { 
      method: 'POST', 
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${getToken()}` }, 
      body: JSON.stringify({ text }) 
    });
    if (!res.ok) {
      const respText = await res.text();
      const errData = respText ? JSON.parse(respText) : { msg: 'Comment failed' };
      throw new Error(errData.msg || 'Comment failed');
    }
    fetchAll();
  }

  async function handleCheckout() {
    if (cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }
    try {
      const res = await fetch('/api/cart/checkout', { 
        method: 'POST', 
        headers: { Authorization: `Bearer ${getToken()}` } 
      });
      if (!res.ok) {
        const text = await res.text();
        const errData = text ? JSON.parse(text) : { msg: 'Checkout failed' };
        throw new Error(errData.msg || 'Checkout failed');
      }
      alert('✓ Checkout successful! Your order has been placed.');
      setShowCart(false);
      fetchAll();
    } catch (err) {
      alert(`✗ ${err.message}`);
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><FiPackage className="me-2" style={{ verticalAlign: 'middle' }} />Marketplace</h2>
        <Button variant="primary" onClick={() => setShowCart(true)} className="position-relative">
          <FiShoppingCart className="me-2" />Cart
          {cart.items.length > 0 && <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">{cart.items.length}</Badge>}
        </Button>
      </div>

      <UploadForm onUploaded={onUploaded} />

      <h4 className="mb-3"><FiTrendingUp className="me-2" style={{ verticalAlign: 'middle' }} />Available Products</h4>
      {products.length === 0 ? <p className="text-muted">No products listed yet</p> : products.map(p => <ProductCard key={p._id} p={p} onBuy={onBuy} onAddCart={onAddCart} onComment={onComment} cart={cart} />)}

      {/* Cart Modal */}
      <Modal show={showCart} onHide={() => setShowCart(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><FiShoppingCart className="me-2" />Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.items.length === 0 ? (
            <p className="text-muted">Your cart is empty</p>
          ) : (
            <>
              {cart.items.map(item => (
                <div key={item.product?._id} className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                  <div>
                    <h6 className="mb-0">{item.product?.title}</h6>
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </div>
                  <div>
                    <h6 className="mb-0">${(item.product?.price * item.quantity).toFixed(2)}</h6>
                  </div>
                </div>
              ))}
              <div className="border-top pt-2 mt-2">
                <h5>Total: <span style={{ color: '#0052CC' }}>${cart.total?.toFixed(2)}</span></h5>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCart(false)}>Close</Button>
          <Button variant="primary" onClick={handleCheckout} disabled={cart.items.length === 0}>
            <FiCreditCard className="me-2" />Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
