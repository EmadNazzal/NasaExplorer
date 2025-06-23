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
  const [sol, setSol] = useState("");
  const [camera, setCamera] = useState("");
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: photos = [],
    error,
    isFetching,
    refetch,
  } = useMarsRoverPhotos({ sol, page, camera }, { enabled: false });

  // Reset search state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasSearched(false);
      setSol("");
      setCamera("");
      setPage(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = () => {
    if (!sol.trim()) {
      alert("Please enter a Sol number to search for photos");
      return;
    }
    setPage(1);
    setHasSearched(true);
    refetch();
  };

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  // Limit photos to 20 per page
  const photosPerPage = 20;
  const displayedPhotos = photos.slice(0, photosPerPage);
  const totalPages = Math.ceil(photos.length / photosPerPage);

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
          backdropFilter: "blur(20px)",
          padding: "2rem",
          borderRadius: "20px",
          maxWidth: "1200px",
          width: "100%",
          height: "90vh",
          overflowY: "auto",
          position: "relative",
          color: "#ffffff",
          zIndex: 1,
          border: "1px solid rgba(100, 255, 218, 0.1)",
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
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
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
            fontSize: "2.5rem",
            marginBottom: "2rem",
            fontWeight: "bold",
          }}
        >
          Mars Rover Photo Gallery
        </h2>

        {/* Search Controls */}
        <div
          style={{
            background: "rgba(15, 15, 31, 0.6)",
            padding: "1.5rem",
            borderRadius: "15px",
            marginBottom: "2rem",
            border: "1px solid rgba(100, 255, 218, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "end",
            }}
          >
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label style={labelStyle}>Sol Number *</label>
              <input
                type="number"
                value={sol}
                onChange={(e) => setSol(e.target.value)}
                placeholder="e.g. 1000"
                style={inputStyle}
                min="1"
              />
            </div>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label style={labelStyle}>Camera (Optional)</label>
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                style={inputStyle}
              >
                <option value="">All Cameras</option>
                <option value="FHAZ">Front Hazard Avoidance</option>
                <option value="RHAZ">Rear Hazard Avoidance</option>
                <option value="MAST">Mast Camera</option>
                <option value="CHEMCAM">Chemistry and Camera</option>
                <option value="MAHLI">Hand Lens Imager</option>
                <option value="MARDI">Descent Imager</option>
                <option value="NAVCAM">Navigation Camera</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              disabled={isFetching}
              style={{
                ...buttonStyle,
                minWidth: "150px",
                height: "fit-content",
              }}
            >
              {isFetching ? "Searching..." : "🔍 Search Photos"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "rgba(255, 107, 107, 0.1)",
              border: "1px solid rgba(255, 107, 107, 0.3)",
              padding: "1rem",
              borderRadius: "10px",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#ff6b6b",
            }}
          >
            {error.message}
          </div>
        )}

        {/* Loading State */}
        {isFetching && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "3px solid rgba(100, 255, 218, 0.3)",
                borderTop: "3px solid #64ffda",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            />
            <p style={{ marginTop: "1rem", color: "#64ffda" }}>
              Loading Mars photos...
            </p>
          </div>
        )}

        {/* Results Info */}
        {hasSearched && !isFetching && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "rgba(100, 255, 218, 0.05)",
              borderRadius: "10px",
              border: "1px solid rgba(100, 255, 218, 0.1)",
            }}
          >
            <p style={{ color: "#64ffda", margin: 0, fontSize: "1.1rem" }}>
              {photos.length > 0
                ? `Found ${photos.length} photos from Sol ${sol} ${
                    camera ? `(${camera} camera)` : ""
                  }`
                : `No photos found for Sol ${sol} ${
                    camera ? `with ${camera} camera` : ""
                  }`}
            </p>
          </div>
        )}

        {/* Photo Grid */}
        {hasSearched && displayedPhotos.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {displayedPhotos.map((photo) => (
                <div key={photo.id} style={photoCardStyle}>
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={photo.img_src}
                      alt={`Mars photo ${photo.id}`}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                      onClick={() => window.open(photo.img_src, "_blank")}
                    />
                  </div>
                  <div style={{ padding: "1rem 0" }}>
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "1rem",
                        color: "#64ffda",
                        fontWeight: "bold",
                      }}
                    >
                      {photo.camera.full_name}
                    </p>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "0.9rem",
                        color: "#888",
                      }}
                    >
                      Sol {photo.sol} • Earth Date: {photo.earth_date}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div style={paginationStyle}>
              <button
                onClick={handlePrev}
                disabled={page === 1}
                style={paginationButtonStyle(page === 1)}
              >
                ← Previous
              </button>
              <div style={pageIndicatorStyle}>
                Page {page} of {Math.max(totalPages, 1)}
                <br />
                <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                  Showing {Math.min(photosPerPage, photos.length)} of{" "}
                  {photos.length} photos
                </span>
              </div>
              <button
                onClick={handleNext}
                disabled={displayedPhotos.length < photosPerPage}
                style={paginationButtonStyle(
                  displayedPhotos.length < photosPerPage
                )}
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!hasSearched && !isFetching && (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div
              style={{
                fontSize: "4rem",
                marginBottom: "1rem",
                opacity: 0.3,
              }}
            >
              🔍
            </div>
            <h3 style={{ color: "#64ffda", marginBottom: "1rem" }}>
              Ready to Explore Mars?
            </h3>
            <p style={{ color: "#888", maxWidth: "500px", margin: "0 auto" }}>
              Enter a Sol number (Martian day) to view photos captured by NASA's
              Mars rovers. Each Sol represents one day on Mars (about 24 hours
              and 37 minutes).
            </p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  color: "#64ffda",
  fontSize: "0.9rem",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "10px",
  border: "1px solid rgba(100, 255, 218, 0.3)",
  background: "rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
  fontSize: "1rem",
  backdropFilter: "blur(10px)",
  transition: "border-color 0.3s ease",
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
  borderRadius: "15px",
  border: "1px solid rgba(100, 255, 218, 0.1)",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
};

const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  padding: "1.5rem 0",
  borderTop: "1px solid rgba(100, 255, 218, 0.1)",
};

const paginationButtonStyle = (disabled) => ({
  background: disabled
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(100, 255, 218, 0.2)",
  color: disabled ? "#444" : "#64ffda",
  border: "1px solid rgba(100, 255, 218, 0.3)",
  padding: "0.75rem 1.5rem",
  borderRadius: "10px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  opacity: disabled ? 0.5 : 1,
});

const pageIndicatorStyle = {
  color: "#64ffda",
  fontWeight: "bold",
  padding: "1rem 1.5rem",
  background: "rgba(100, 255, 218, 0.1)",
  borderRadius: "10px",
  border: "1px solid rgba(100, 255, 218, 0.2)",
  textAlign: "center",
  minWidth: "150px",
};

export default MarsRoverPhotos;
