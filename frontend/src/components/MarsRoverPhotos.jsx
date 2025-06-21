import { useState } from "react";
import AnimatedStarfield from "./AnimatedStarfield";

const MarsRoverPhotos = ({ onClick }) => (
  <div style={{ textAlign: "center", margin: "1rem 0" }}>
    <button
      onClick={onClick}
      style={{
        padding: "1rem 2rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "1.1rem",
        border: "none",
        borderRadius: "12px",
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
      🚀 Explore Mars Rover Photos
    </button>
  </div>
);

export const MarsRoverPhotosModal = ({ isOpen, onClose }) => {
  const [photos, setPhotos] = useState([]);
  const [sol, setSol] = useState("1000");
  const [camera, setCamera] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const fetchPhotos = async (targetPage = page) => {
    setLoading(true);
    setError("");
    setPhotos([]);
    try {
      let query = `sol=${sol}&page=${targetPage}`;
      if (camera) query += `&camera=${camera}`;
      const res = await fetch(
        `http://localhost:5000/api/nasa/mars-rover?${query}`
      );
      const json = await res.json();
      setPhotos(json.photos || []);
    } catch (err) {
      setError(err.message || "Failed to fetch photos");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(nextPage);
  };

  const handlePrev = () => {
    const prevPage = Math.max(page - 1, 1);
    setPage(prevPage);
    fetchPhotos(prevPage);
  };

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
            style={{
              padding: "0.75rem",
              borderRadius: "10px",
              border: "1px solid rgba(100, 255, 218, 0.3)",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              fontSize: "1rem",
              backdropFilter: "blur(10px)",
            }}
          />
          <input
            type="text"
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            placeholder="Camera (optional)"
            style={{
              padding: "0.75rem",
              borderRadius: "10px",
              border: "1px solid rgba(100, 255, 218, 0.3)",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              fontSize: "1rem",
              backdropFilter: "blur(10px)",
            }}
          />
          <button
            onClick={() => {
              setPage(1);
              fetchPhotos(1);
            }}
            style={{
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
            }}
          >
            {loading ? "Loading..." : "🔍 Get Photos"}
          </button>
        </div>

        {error && (
          <p
            style={{
              color: "#ff6b6b",
              marginTop: "1rem",
              textAlign: "center",
            }}
          >
            {error}
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
            <div
              key={photo.id}
              style={{
                background: "rgba(15, 15, 31, 0.8)",
                padding: "0.75rem",
                borderRadius: "15px",
                border: "1px solid rgba(100, 255, 218, 0.1)",
              }}
            >
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1.5rem",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <button
              onClick={handlePrev}
              disabled={page === 1}
              style={{
                background:
                  page === 1
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(100, 255, 218, 0.2)",
                color: page === 1 ? "#666" : "#64ffda",
                border: "1px solid rgba(100, 255, 218, 0.3)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              ← Previous
            </button>
            <span
              style={{
                color: "#64ffda",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                background: "rgba(100, 255, 218, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(100, 255, 218, 0.2)",
              }}
            >
              Page {page}
            </span>
            <button
              onClick={handleNext}
              style={{
                background: "rgba(100, 255, 218, 0.2)",
                color: "#64ffda",
                border: "1px solid rgba(100, 255, 218, 0.3)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarsRoverPhotos;
