import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import NavbarComponent from "./components/Navbar";
import Header from "./components/Header";
import Featured from "./components/Featured";
import Footer from "./components/Footer";
import Slider from "./components/slider";
import About from "./components/About";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import FeaturedPage from './pages/FeaturedPage';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/ProtectedRoute';

function Home(){
  return (
    <>
      <Header />
      <Slider />
      <Featured />
      <About />
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/featured" element={<FeaturedPage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;