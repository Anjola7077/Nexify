import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const NavbarComponent = () => {
  return (
    <Navbar expand="lg" className="bg-dark navbar-dark py-3 shadow-sm sticky-top">
      <Container>
        <Navbar.Brand href="#" className="fw-bold text-uppercase">
           NEXIFY
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          <Nav className="align-items-center">
            <Nav.Link href="#home" className="mx-2">Home</Nav.Link>
            <Nav.Link href="#featured" className="mx-2">Featured</Nav.Link>
            <Nav.Link href="#contact" className="mx-2">About</Nav.Link>
            <Button variant="outline-light" className="ms-2 px-4">Shop Now</Button>
          <Button variant="outline-info" className="ms-2 px-4">Login</Button>
            <Button variant="primary" className="ms-2 px-4">Sign up</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;