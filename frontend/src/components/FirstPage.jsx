import React, { useState, useEffect } from "react";
import ApodNasa, { ApodNasaModal } from "./ApodNasa";
import EpicNasa, { EpicNasaModal } from "./EpicNasa";
import ImageAndVideo, { ImageAndVideoModal } from "./ImageAndVideo";
import MarsRoverPhotos, { MarsRoverPhotosModal } from "./MarsRoverPhotos";
import NearEarth, { NearEarthModal } from "./NearEarth";
const FirstPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const apiOptions = [
    {
      title: "Astronomy Picture of the Day",
      subtitle: "APOD",
      description:
        "Discover the cosmos with daily astronomical images and explanations",
      icon: "🌌",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Mars Rover Photos",
      subtitle: "MRP",
      description: "Explore the Red Planet through the eyes of NASA's rovers",
      icon: "🔴",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Earth Polychromatic Imaging Camera",
      subtitle: "EPIC",
      description: "View our beautiful planet from space in stunning detail",
      icon: "🌍",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Near Earth Object Web Service",
      subtitle: "NeoWs",
      description: "Track asteroids and comets approaching our planet",
      icon: "☄️",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      title: "NASA Image and Video Library",
      subtitle: "NIVL",
      description: "Access NASA's vast collection of space imagery and videos",
      icon: "📸",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div
        style={{
          ...styles.starField,
          transform: `translate(${mousePos.x * 0.01}px, ${
            mousePos.y * 0.01
          }px)`,
        }}
      >
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.star,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div style={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoText}>NASA</span>
          <span style={styles.logoSubtext}>EXPLORER</span>
        </div>
        <div style={styles.headerLine}></div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.title}>
            <span style={styles.titleMain}>EXPLORE THE</span>
            <span style={styles.titleAccent}>UNIVERSE</span>
          </h1>
          <p style={styles.subtitle}>
            Access NASA's most powerful APIs and discover the wonders of space
            exploration
          </p>
        </div>

        {/* API Grid */}
        <div style={styles.grid}>
          {apiOptions.map((option, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                animationDelay: `${index * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-10px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0, 0, 0, 0.3)";
              }}
            >
              <div
                style={{
                  ...styles.cardGradient,
                  background: option.gradient,
                }}
              ></div>

              <div style={styles.cardContent}>
                <div style={styles.cardIcon}>{option.icon}</div>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{option.title}</h3>
                  <span style={styles.cardSubtitle}>{option.subtitle}</span>
                </div>
                <p style={styles.cardDescription}>{option.description}</p>
                {option.subtitle === "APOD" && (
                  <ApodNasa onClick={() => setActiveModal("APOD")} />
                )}
                {option.subtitle === "MRP" && (
                  <MarsRoverPhotos onClick={() => setActiveModal("MRP")} />
                )}
                {option.subtitle === "EPIC" && (
                  <EpicNasa onClick={() => setActiveModal("EPIC")} />
                )}
                {option.subtitle === "NeoWs" && (
                  <NearEarth onClick={() => setActiveModal("NeoWs")} />
                )}
                {option.subtitle === "NIVL" && (
                  <ImageAndVideo onClick={() => setActiveModal("NIVL")} />
                )}
                {/*
                  <span>EXPLORE</span>
                  <div style={styles.buttonArrow}>→</div>
                */}
              </div>

              <div style={styles.cardBorder}></div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>Powered by NASA Open Data Portal</p>
          <div style={styles.footerLinks}>
            <span>About</span>
            <span>•</span>
            <span>API Documentation</span>
            <span>•</span>
            <span>Contact</span>
          </div>
        </div>

        {/* Modal Portal */}
        <ApodNasaModal
          isOpen={activeModal === "APOD"}
          onClose={() => setActiveModal(null)}
        />
        <MarsRoverPhotosModal
          isOpen={activeModal === "MRP"}
          onClose={() => setActiveModal(null)}
        />
        <EpicNasaModal
          isOpen={activeModal === "EPIC"}
          onClose={() => setActiveModal(null)}
        />
        <NearEarthModal
          isOpen={activeModal === "NeoWs"}
          onClose={() => setActiveModal(null)}
        />
        <ImageAndVideoModal
          isOpen={activeModal === "NIVL"}
          onClose={() => setActiveModal(null)}
        />
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
    color: "#ffffff",
    fontFamily: "'Inter', 'Arial', sans-serif",
    overflow: "hidden",
    position: "relative",
  },

  starField: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
  },

  star: {
    position: "absolute",
    width: "2px",
    height: "2px",
    background: "#ffffff",
    borderRadius: "50%",
    animation: "twinkle 3s infinite",
    boxShadow: "0 0 6px rgba(255, 255, 255, 0.8)",
  },

  particles: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
  },

  particle: {
    position: "absolute",
    width: "4px",
    height: "4px",
    background: "rgba(0, 255, 255, 0.6)",
    borderRadius: "50%",
    animation: "float 20s infinite linear",
  },

  header: {
    position: "relative",
    zIndex: 10,
    padding: "2rem 4rem",
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },

  logo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  logoText: {
    fontSize: "2.5rem",
    fontWeight: "900",
    letterSpacing: "0.2em",
    background: "linear-gradient(45deg, #00ffff, #0080ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
  },

  logoSubtext: {
    fontSize: "0.8rem",
    letterSpacing: "0.3em",
    color: "#888",
    marginTop: "-0.5rem",
  },

  headerLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, #00ffff, transparent)",
  },

  main: {
    position: "relative",
    zIndex: 10,
    padding: "0 4rem 4rem",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  hero: {
    textAlign: "center",
    marginBottom: "4rem",
  },

  title: {
    fontSize: "clamp(3rem, 8vw, 6rem)",
    fontWeight: "900",
    margin: 0,
    lineHeight: "1.1",
    marginBottom: "1rem",
  },

  titleMain: {
    display: "block",
    color: "#ffffff",
    textShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
  },

  titleAccent: {
    display: "block",
    background:
      "linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f, #4ecdc4, #45b7d1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
    animation: "shimmer 3s infinite",
  },

  subtitle: {
    fontSize: "1.3rem",
    color: "#cccccc",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "2rem",
    marginTop: "3rem",
  },

  card: {
    position: "relative",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    padding: "2rem",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    animation: "fadeInUp 0.8s ease-out forwards",
    opacity: 0,
    transform: "translateY(30px)",
    overflow: "hidden",
  },

  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    borderRadius: "20px 20px 0 0",
  },

  cardContent: {
    position: "relative",
    zIndex: 2,
  },

  cardIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
    display: "block",
  },

  cardHeader: {
    marginBottom: "1rem",
  },

  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: 0,
    marginBottom: "0.5rem",
    color: "#ffffff",
  },

  cardSubtitle: {
    fontSize: "0.9rem",
    color: "#00ffff",
    fontWeight: "600",
    letterSpacing: "0.1em",
  },

  cardDescription: {
    color: "#cccccc",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
  },

  cardButton: {
    background: "linear-gradient(45deg, #00ffff, #0080ff)",
    border: "none",
    borderRadius: "30px",
    padding: "0.8rem 2rem",
    color: "#000",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.3s ease",
    fontSize: "0.9rem",
    letterSpacing: "0.05em",
  },

  buttonArrow: {
    transition: "transform 0.3s ease",
  },

  cardBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "20px",
    padding: "1px",
    background:
      "linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.2), transparent)",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    pointerEvents: "none",
  },

  footer: {
    position: "relative",
    zIndex: 10,
    padding: "2rem 4rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: "4rem",
  },

  footerContent: {
    textAlign: "center",
    color: "#888",
    fontSize: "0.9rem",
  },

  footerLinks: {
    marginTop: "0.5rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    alignItems: "center",
  },

  // Add CSS animations via style tag
  "@keyframes twinkle": {
    "0%, 100%": { opacity: 0.3 },
    "50%": { opacity: 1 },
  },

  "@keyframes float": {
    "0%": { transform: "translateY(100vh) rotate(0deg)" },
    "100%": { transform: "translateY(-100px) rotate(360deg)" },
  },

  "@keyframes shimmer": {
    "0%": { backgroundPosition: "-200% center" },
    "100%": { backgroundPosition: "200% center" },
  },

  "@keyframes fadeInUp": {
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
};

// Add global styles
const globalStyles = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  
  @keyframes float {
    0% { transform: translateY(100vh) rotate(0deg); }
    100% { transform: translateY(-100px) rotate(360deg); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
`;

// Inject global styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

export default FirstPage;
