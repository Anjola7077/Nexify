import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import NavbarComponent from "./components/Navbar";
import Header from "./components/Header";
import Featured from "./components/Featured";
import Footer from "./components/Footer";
import Slider from "./components/slider";


function App() {
  return (
    <div className="App">
      <NavbarComponent />
      <Header />
      <Slider />
      <Featured />
      <About />
      <Footer />
    </div>
  );
}

export default App;