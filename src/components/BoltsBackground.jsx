import React from "react";
import backgroundImage from "../static/image/webfonas-1.jpg";

const BoltsBackground = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 bg-[#091c14]"
    style={{
      backgroundImage: `linear-gradient(rgba(9, 28, 20, 0.52), rgba(7, 20, 16, 0.74)), url(${backgroundImage})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      filter: "saturate(0.8) brightness(1.12) contrast(1.05) hue-rotate(-8deg)",
    }}
  />
);

export default BoltsBackground;
