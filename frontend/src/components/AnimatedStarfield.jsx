import React from "react";

// Shared animated background component
const AnimatedStarfield = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    {[...Array(150)].map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: Math.random() < 0.3 ? "2px" : "1px",
          height: Math.random() < 0.3 ? "2px" : "1px",
          backgroundColor: Math.random() < 0.1 ? "#64ffda" : "#ffffff",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `twinkle ${
            2 + Math.random() * 3
          }s ease-in-out infinite alternate`,
          opacity: Math.random() * 0.8 + 0.2,
        }}
      />
    ))}
    <style>{`
      @keyframes twinkle {
        from { opacity: 0.2; transform: scale(1); }
        to { opacity: 1; transform: scale(1.2); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(2deg); }
        66% { transform: translateY(-5px) rotate(-1deg); }
      }
    `}</style>
  </div>
);

export default AnimatedStarfield;
