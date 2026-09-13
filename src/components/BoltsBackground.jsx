import React from "react";
import backgroundImage from "../static/image/webfonas-1.jpg";

const BoltsBackground = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 bg-[#010b04]"
    style={{
      backgroundImage: `linear-gradient(rgba(0, 10, 3, 0.62), rgba(0, 10, 3, 0.78)), url(${backgroundImage})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}
  />
);

export default BoltsBackground;
