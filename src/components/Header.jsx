import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import headerImage from "../assets/header.png";
const Header = () => {
  return (
    <header className="header-section d-flex align-items-center text-light">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-start">
            <h1 className="display-4 fw-bold mb-3">Discover the Latest Smartphones</h1>
            <p className="lead mb-4">
              Find premium smartphones at unbeatable prices. Get free delivery and 1-year warranty.
            </p>
            <Button variant="dark" size="lg" className="rounded-pill" window="_blank" href="#featured">
              Explore Deals
            </Button>
          </Col>
          <Col md={6} className="text-center">
            <img
              src={headerImage}
              alt="Smartphone"
              className="img-fluid phone-img"
              style={{ height: "500px", objectFit: "cover" }}
            />
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;