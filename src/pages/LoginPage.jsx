import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Login failed');
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
        <h2 className="mb-1 text-center fw-bold">🔓 Welcome Back</h2>
        <p className="text-center text-muted mb-4">Sign in to your Nexify account</p>
        
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>❌ {error}</Alert>}
        
        <Form onSubmit={submit}>
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
          </Form.Group>
          
          <Button 
            className="w-100 mb-3 fw-bold" 
            variant="primary" 
            type="submit" 
            disabled={loading}
            size="lg"
          >
            {loading ? <><Spinner size="sm" className="me-2"/>Logging in...</> : '✓ Login'}
          </Button>
        </Form>

        <p className="text-center text-muted">
          Don't have an account? <Link to="/register" className="text-decoration-none fw-bold">Sign up</Link>
        </p>
      </div>
    </Container>
  );
}
