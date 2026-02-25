import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Registration failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div style={{ maxWidth: 420, width: '100%' }} className="shadow-lg p-4 rounded bg-white">
        <h2 className="mb-1 text-center fw-bold">✨ Join Nexify</h2>
        <p className="text-center text-muted mb-4">Create your account and start selling</p>
        
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>❌ {error}</Alert>}
        
        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Full Name</Form.Label>
            <Form.Control 
              placeholder="John Doe" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email Address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              disabled={loading}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              disabled={loading}
            />
            <small className="text-muted">At least 6 characters</small>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Confirm Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required
              disabled={loading}
            />
          </Form.Group>
          
          <Button 
            className="w-100 mb-3 fw-bold" 
            variant="success" 
            type="submit" 
            disabled={loading}
            size="lg"
          >
            {loading ? <><Spinner size="sm" className="me-2"/>Creating account...</> : '✓ Sign Up'}
          </Button>
        </Form>

        <p className="text-center text-muted">
          Already have an account? <Link to="/login" className="text-decoration-none fw-bold">Login</Link>
        </p>
      </div>
    </Container>
  );
}
