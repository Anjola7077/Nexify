import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import i15 from "../assets/i15.png";
import s24 from "../assets/s24.png";
import pixel from "../assets/pixel.png";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: "$999",
    img: i15
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    price: "$899",
    img: s24
  },
  {
    id: 3,
    name: "Google Pixel 8",
    price: "$799",
    img: pixel
  },
];

const Featured = () => {
  return (
    <section id="featured" className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5 fw-bold">Featured Phones</h2>
        <Row>
          {products.map((product) => (
            <Col md={4} sm={6} key={product.id} className="mb-4">
              <Card className="border-0 shadow-lg h-100">
                <Card.Img variant="top" src={product.img} className="featured-img" />
                <Card.Body className="text-center">
                  <Card.Title className="fw-semibold">{product.name}</Card.Title>
                  <Card.Text className="text-muted mb-3">{product.price}</Card.Text>
                  <Button variant="dark" className="rounded-pill px-4">Buy Now</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Featured;