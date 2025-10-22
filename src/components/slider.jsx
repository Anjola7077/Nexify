import React from "react";
import redmi from "../assets/redmi.png";
import infinix from "../assets/infinix.png";
import samsung from "../assets/samsung.png";
import iphone from "../assets/iphone.png";
import google from "../assets/google.png";

const Slider = () => {
  const logos = [redmi, infinix, samsung, iphone, google];

  return (
    <div className="slider-section d-flex align-items-center justify-content-center flex-wrap py-4">
      {logos.map((src, i) => (
        <img key={i} src={src} alt={`logo-${i}`} className="logo mx-3" />
      ))}
    </div>
  );
};
export default Slider;