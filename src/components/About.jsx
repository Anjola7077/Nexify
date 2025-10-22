import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaShippingFast, FaShieldAlt, FaCreditCard } from "react-icons/fa";

const About = () => {
  return (
    <section id="about" className="about-section py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <small className="text-uppercase text-muted fw-semibold">Who we are</small>
            <h2 className="fw-bold mt-2 mb-3">About Nexify</h2>
            <p className="text-muted mb-4">
              Nexify curates the best smartphones with honest prices, fast shipping and trusted warranty support.
              We handpick each device and make buying easy — from comparison to doorstep delivery.
            </p>

            <ul className="list-unstyled about-features mb-4">
              <li className="d-flex align-items-center mb-2">
                <span className="about-feature-icon me-3"><FaShippingFast aria-hidden="true" /></span>
                <span className="text-dark fw-semibold">48‑hour express shipping</span>
              </li>
              <li className="d-flex align-items-center mb-2">
                <span className="about-feature-icon me-3"><FaShieldAlt aria-hidden="true" /></span>
                <span className="text-dark fw-semibold">1‑year warranty & easy returns</span>
              </li>
              <li className="d-flex align-items-center">
                <span className="about-feature-icon me-3"><FaCreditCard aria-hidden="true" /></span>
                <span className="text-dark fw-semibold">Flexible payment & EMI options</span>
              </li>
            </ul>

            <div>
              <Button variant="primary" className="me-2">Shop Phones</Button>
              <Button variant="outline-secondary">Learn More</Button>
            </div>
          </Col>

          <Col md={6} className="text-center">
            <img src="/aboutimg.png" alt="About Nexify" className="about-img img-fluid" />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;