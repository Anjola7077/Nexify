import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi';

export default function FeaturedPage() {
  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1 className="mb-3" style={{ color: '#0052CC' }}>Featured Devices</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Discover the latest mobile phones and gadgets from trusted sellers in our marketplace.</p>
      </div>

      <Row className="g-4">
        <Col md={4}>
          <div className="card shadow-sm h-100" style={{ border: 'none', borderTop: '4px solid #0052CC' }}>
            <div className="card-body text-center">
              <FiStar size={48} style={{ color: '#0052CC', marginBottom: '1rem' }} />
              <h5 className="card-title">Premium Selection</h5>
              <p className="card-text text-muted">Handpicked devices verified by our community for quality and authenticity.</p>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="card shadow-sm h-100" style={{ border: 'none', borderTop: '4px solid #0052CC' }}>
            <div className="card-body text-center">
              <FiTrendingUp size={48} style={{ color: '#0052CC', marginBottom: '1rem' }} />
              <h5 className="card-title">Best Prices</h5>
              <p className="card-text text-muted">Compare prices from multiple sellers and find the best deals on your favorite devices.</p>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="card shadow-sm h-100" style={{ border: 'none', borderTop: '4px solid #0052CC' }}>
            <div className="card-body text-center">
              <FiUsers size={48} style={{ color: '#0052CC', marginBottom: '1rem' }} />
              <h5 className="card-title">Community Driven</h5>
              <p className="card-text text-muted">Ratings and reviews from real users help you make informed purchasing decisions.</p>
            </div>
          </div>
        </Col>
      </Row>

      <div className="mt-5 p-4" style={{ backgroundColor: '#f8f9ff', borderRadius: '8px' }}>
        <h4 style={{ color: '#0052CC' }}>Why Choose Nexify?</h4>
        <ul className="mt-3">
          <li>Secure transactions with verified sellers</li>
          <li>Easy product listing for sellers</li>
          <li>Real-time cart and checkout</li>
          <li>Community comments and ratings</li>
          <li>Quick and reliable service</li>
        </ul>
      </div>
    </Container>
  );
}
