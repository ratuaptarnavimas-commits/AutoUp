import React from "react";
import backgroundImage from "../static/image/vaziuokle-1.jpg.jpeg";

const BoltsBackground = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 bg-[#010b04]"
    style={{
      backgroundImage: `linear-gradient(rgba(0, 10, 3, 0.78), rgba(0, 10, 3, 0.88)), url(${backgroundImage})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}
  />
);

export default BoltsBackground;
