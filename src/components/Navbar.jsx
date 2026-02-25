import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, Dropdown, Modal, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiLock, FiTrash2, FiUser } from 'react-icons/fi';

const NavbarComponent = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [deletePassword, setDeletePassword] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(passwordForm)
      });
      
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      
      if (!res.ok) throw new Error(data.msg || 'Failed to change password');
      
      setMsg('Password changed successfully!');
      setMsgType('success');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowChangePassword(false), 2000);
    } catch (err) {
      setMsg(err.message);
      setMsgType('danger');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setLoading(true);
    setMsg('');
    
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password: deletePassword })
      });
      
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      
      if (!res.ok) throw new Error(data.msg || 'Failed to delete account');
      
      // Clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      alert('Account deleted successfully. Redirecting...');
      navigate('/login');
    } catch (err) {
      setMsg(err.message);
      setMsgType('danger');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar expand="lg" className="navbar-dark py-3 shadow-sm sticky-top" style={{ backgroundColor: '#000000' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-uppercase text-white">
            NEXIFY
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className="justify-content-end">
            <Nav className="align-items-center">
              <Nav.Link as={Link} to="/" className="mx-2 text-white">Home</Nav.Link>
              <Nav.Link as={Link} to="/featured" className="mx-2 text-white">Featured</Nav.Link>
              <Nav.Link as={Link} to="/about" className="mx-2 text-white">About</Nav.Link>
              <Button as={Link} to="/dashboard" variant="light" className="ms-2 px-4">Shop Now</Button>
              
              {!user && <Button as={Link} to="/login" variant="outline-light" className="ms-2 px-4">Login</Button>}
              {!user && <Button as={Link} to="/register" variant="light" className="ms-2 px-4 fw-bold">Sign up</Button>}
              
              {user && (
                <Dropdown className="ms-2" align="end">
                  <Dropdown.Toggle 
                    variant="light" 
                    id="dropdown-basic"
                    className="d-flex align-items-center gap-2"
                  >
                    <FiUser size={18} />
                    {user.name || user.email}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>{user.email}</Dropdown.Header>
                    <Dropdown.Item as="button" onClick={() => setShowChangePassword(true)}>
                      <FiLock size={16} className="me-2" style={{ verticalAlign: 'middle' }} />
                      Change Password
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as="button" onClick={logout} className="text-danger">
                      <FiLogOut size={16} className="me-2" style={{ verticalAlign: 'middle' }} />
                      Sign Out
                    </Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => setShowDeleteConfirm(true)} className="text-danger">
                      <FiTrash2 size={16} className="me-2" style={{ verticalAlign: 'middle' }} />
                      Delete Account
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Change Password Modal */}
      <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><FiLock className="me-2" />Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {msg && <Alert variant={msgType}>{msg}</Alert>}
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter current password"
                value={passwordForm.oldPassword}
                onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter new password (min 6 chars)"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                required
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowChangePassword(false)} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><FiTrash2 className="me-2 text-danger" />Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {msg && <Alert variant={msgType}>{msg}</Alert>}
          <Alert variant="warning">
            <strong>Warning!</strong> This action is permanent and cannot be undone. All your products and data will be deleted.
          </Alert>
          <p>To confirm account deletion, enter your password:</p>
          <Form.Control 
            type="password" 
            placeholder="Enter your password"
            value={deletePassword}
            onChange={e => setDeletePassword(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteAccount}
            disabled={loading || !deletePassword}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavbarComponent;