import React from "react";
import boltsBackground from "../static/image/autoup-bolts-background.webp";

const BoltsBackground = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 bg-[#010b04]"
    style={{
      backgroundImage: `linear-gradient(rgba(0, 10, 3, 0.16), rgba(0, 10, 3, 0.38)), url(${boltsBackground})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}
  />
);

export default BoltsBackground;
