import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiInfo, FiTarget, FiAward } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1 className="mb-3" style={{ color: '#0052CC' }}>About Nexify</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Your trusted marketplace for buying and selling mobile devices</p>
      </div>

      <Row className="g-4 mb-5">
        <Col md={6}>
          <div style={{ backgroundColor: '#f8f9ff', padding: '2rem', borderRadius: '8px' }}>
            <FiInfo size={40} style={{ color: '#0052CC', marginBottom: '1rem' }} />
            <h4 style={{ color: '#0052CC' }}>Our Mission</h4>
            <p>Nexify aims to create a seamless, secure, and community-driven marketplace where buyers and sellers can connect with confidence. We believe in transparency, quality, and excellent service.</p>
          </div>
        </Col>
        <Col md={6}>
          <div style={{ backgroundColor: '#f8f9ff', padding: '2rem', borderRadius: '8px' }}>
            <FiTarget size={40} style={{ color: '#0052CC', marginBottom: '1rem' }} />
            <h4 style={{ color: '#0052CC' }}>Our Vision</h4>
            <p>To be the leading platform for mobile device transactions, empowering individuals and businesses to buy, sell, and trade their devices with confidence and ease.</p>
          </div>
        </Col>
      </Row>

      <div className="mb-5">
        <h3 style={{ color: '#0052CC' }} className="mb-4">Why Our Users Love Nexify</h3>
        <Row className="g-3">
          <Col md={6}>
            <div className="d-flex gap-3">
              <FiAward size={32} style={{ color: '#0052CC', flexShrink: 0 }} />
              <div>
                <h6>Verified Sellers</h6>
                <p className="text-muted small">All sellers are verified to ensure authenticity and reliability.</p>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex gap-3">
              <FiAward size={32} style={{ color: '#0052CC', flexShrink: 0 }} />
              <div>
                <h6>Easy Transactions</h6>
                <p className="text-muted small">Simple and secure checkout process for peace of mind.</p>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex gap-3">
              <FiAward size={32} style={{ color: '#0052CC', flexShrink: 0 }} />
              <div>
                <h6>Community Reviews</h6>
                <p className="text-muted small">Real feedback from buyers helps you make informed decisions.</p>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex gap-3">
              <FiAward size={32} style={{ color: '#0052CC', flexShrink: 0 }} />
              <div>
                <h6>Wide Selection</h6>
                <p className="text-muted small">Browse thousands of devices from top brands.</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div style={{ backgroundColor: '#f8f9ff', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h4 style={{ color: '#0052CC' }} className="mb-3">Get in Touch</h4>
        <p className="text-muted">Have questions? We're here to help!</p>
        <p className="text-muted">Email: support@nexify.com | Phone: (555) 123-4567</p>
      </div>
    </Container>
  );
}
