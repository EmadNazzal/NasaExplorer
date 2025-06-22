import { useState, useEffect } from "react";
import AnimatedStarfield from "./AnimatedStarfield";
import { useMarsRoverPhotos } from "../hooks/useMarsRoverPhotos";

const MarsRoverPhotos = ({ onClick }) => (
  <div style={{ textAlign: "center", margin: "1rem 0" }}>
    <button
      onClick={onClick}
      style={{
        padding: "1rem 2rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#ffffff",
        fontWeight: "bold",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 12px 35px rgba(102, 126, 234, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)";
      }}
    >
      Explore Mars Rover Photos
    </button>
  </div>
);

export const MarsRoverPhotosModal = ({ isOpen, onClose }) => {
  const [sol, setSol] = useState("1000");
  const [camera, setCamera] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: photos = [],
    error,
    isFetching,
    refetch,
  } = useMarsRoverPhotos({ sol, page, camera }, { enabled: false });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, sol, camera, page]);

  if (!isOpen) return null;

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      <AnimatedStarfield />
      <div
        style={{
          background: "rgba(26, 26, 46, 0.95)",
          padding: "2rem",
          borderRadius: "20px",
          maxWidth: "1000px",
          width: "100%",
          height: "90vh",
          overflowY: "auto",
          position: "relative",
          color: "#ffffff",
          zIndex: 1,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "linear-gradient(135deg, #ff6b6b, #ee5a5a)",
            border: "none",
            borderRadius: "50%",
            width: "2.5rem",
            height: "2.5rem",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h2
          style={{
            textAlign: "center",
            background: "linear-gradient(135deg, #64ffda, #1de9b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2rem",
            marginBottom: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Mars Rover Photos
        </h2>

        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <input
            type="number"
            value={sol}
            onChange={(e) => setSol(e.target.value)}
            placeholder="Sol (e.g. 1000)"
            style={inputStyle}
          />
          <input
            type="text"
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            placeholder="Camera (optional)"
            style={inputStyle}
          />
          <button
            onClick={() => {
              setPage(1);
              refetch();
            }}
            style={buttonStyle}
          >
            {isFetching ? "Loading..." : "🔍 Get Photos"}
          </button>
        </div>

        {error && (
          <p style={{ color: "#ff6b6b", textAlign: "center" }}>
            {error.message}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {photos.map((photo) => (
            <div key={photo.id} style={photoCardStyle}>
              <img
                src={photo.img_src}
                alt={photo.id}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "#64ffda",
                  textAlign: "center",
                }}
              >
                {photo.camera.name}
              </p>
            </div>
          ))}
        </div>

        {photos.length > 0 && (
          <div style={paginationStyle}>
            <button
              onClick={handlePrev}
              disabled={page === 1}
              style={paginationButtonStyle(page === 1)}
            >
              ← Previous
            </button>
            <span style={pageIndicatorStyle}>Page {page}</span>
            <button onClick={handleNext} style={paginationButtonStyle(false)}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "0.75rem",
  borderRadius: "10px",
  border: "1px solid rgba(100, 255, 218, 0.3)",
  background: "rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
  fontSize: "1rem",
  backdropFilter: "blur(10px)",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  background: "linear-gradient(135deg, #64ffda, #1de9b6)",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: "10px",
  color: "#1a1a2e",
  fontSize: "1rem",
  boxShadow: "0 4px 15px rgba(100, 255, 218, 0.3)",
  transition: "all 0.3s ease",
};

const photoCardStyle = {
  background: "rgba(15, 15, 31, 0.8)",
  padding: "0.75rem",
  borderRadius: "15px",
  border: "1px solid rgba(100, 255, 218, 0.1)",
};

const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "1.5rem",
  gap: "1rem",
  alignItems: "center",
};

const paginationButtonStyle = (disabled) => ({
  background: disabled
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(100, 255, 218, 0.2)",
  color: disabled ? "#666" : "#64ffda",
  border: "1px solid rgba(100, 255, 218, 0.3)",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: "bold",
});

const pageIndicatorStyle = {
  color: "#64ffda",
  fontWeight: "bold",
  padding: "0.5rem 1rem",
  background: "rgba(100, 255, 218, 0.1)",
  borderRadius: "8px",
  border: "1px solid rgba(100, 255, 218, 0.2)",
};

export default MarsRoverPhotos;
