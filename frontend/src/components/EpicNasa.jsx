import React, { useState, useEffect } from "react";
import { useEpic } from "../hooks/useEpic";

export const EpicNasa = ({ onClick }) => (
  <div style={{ textAlign: "center", margin: "1rem 0" }}>
    <button
      onClick={onClick}
      style={{
        padding: "1rem 2rem",
        background: "linear-gradient(45deg, #d38312, #a83279)",
        color: "white",
        fontWeight: "bold",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0 8px 25px rgba(211, 131, 18, 0.3)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 12px 35px rgba(211, 131, 18, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 8px 25px rgba(211, 131, 18, 0.3)";
      }}
    >
      Explore EPIC Earth Images
    </button>
  </div>
);

export const EpicNasaModal = ({ isOpen, onClose }) => {
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: photos = [],
    error,
    isFetching,
    refetch,
  } = useEpic(date, { enabled: false });

  // Reset search state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasSearched(false);
      setDate("");
      setPage(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = () => {
    if (!date.trim()) {
      alert("Please select a date to view EPIC images");
      return;
    }
    setPage(1);
    setHasSearched(true);
    refetch();
  };

  // Pagination logic - 12 photos per page for better grid layout
  const photosPerPage = 12;
  const startIndex = (page - 1) * photosPerPage;
  const endIndex = startIndex + photosPerPage;
  const displayedPhotos = photos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(photos.length / photosPerPage);

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  // Get today's date for max date validation
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at center, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      {/* Animated background stars */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(2px 2px at 20px 30px, #fff, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.4), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.7), transparent)
          `,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 100px",
          animation: "twinkle 4s ease-in-out infinite alternate",
          opacity: 0.3,
        }}
      />

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
          border: "1px solid rgba(168, 50, 121, 0.3)",
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
            background: "linear-gradient(135deg, #d38312, #a83279)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2.5rem",
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          EPIC Earth Images
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#888",
            marginBottom: "2rem",
            fontSize: "1.1rem",
          }}
        >
          Earth Polychromatic Imaging Camera - View Earth from space
        </p>

        {/* Search Controls */}
        <div
          style={{
            background: "rgba(15, 15, 31, 0.6)",
            padding: "1.5rem",
            borderRadius: "15px",
            marginBottom: "2rem",
            border: "1px solid rgba(168, 50, 121, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ flex: "1", minWidth: "250px", maxWidth: "400px" }}>
              <label style={labelStyle}>Select Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={today}
                style={inputStyle}
              />
              <small
                style={{
                  color: "#888",
                  fontSize: "0.8rem",
                  display: "block",
                  marginTop: "0.25rem",
                }}
              >
                EPIC images are available from 2015 onwards
              </small>
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
              {isFetching ? "Loading..." : "🌍 Get Images"}
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
                border: "3px solid rgba(211, 131, 18, 0.3)",
                borderTop: "3px solid #d38312",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            />
            <p style={{ marginTop: "1rem", color: "#d38312" }}>
              Loading Earth images from space...
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
              background: "rgba(211, 131, 18, 0.05)",
              borderRadius: "10px",
              border: "1px solid rgba(211, 131, 18, 0.1)",
            }}
          >
            <p style={{ color: "#d38312", margin: 0, fontSize: "1.1rem" }}>
              {photos.length > 0
                ? `Found ${photos.length} EPIC images from ${date}`
                : `No EPIC images found for ${date}`}
            </p>
          </div>
        )}

        {/* Photo Grid */}
        {hasSearched && displayedPhotos.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {displayedPhotos.map((item, index) => (
                <div key={index} style={photoCardStyle}>
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={`https://epic.gsfc.nasa.gov/archive/natural/${item.date
                        .split(" ")[0]
                        .replaceAll("-", "/")}/png/${item.image}.png`}
                      alt={item.caption}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                      onClick={() =>
                        window.open(
                          `https://epic.gsfc.nasa.gov/archive/natural/${item.date
                            .split(" ")[0]
                            .replaceAll("-", "/")}/png/${item.image}.png`,
                          "_blank"
                        )
                      }
                    />
                    {/* Overlay with caption */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.8))",
                        color: "white",
                        padding: "1rem",
                        borderRadius: "0 0 10px 10px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          lineHeight: "1.4",
                        }}
                      >
                        {item.caption}
                      </p>
                    </div>
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.8rem",
                        color: "#d38312",
                        fontWeight: "bold",
                      }}
                    >
                      Image: {item.image}
                    </p>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "0.9rem",
                        color: "#888",
                      }}
                    >
                      Date:{" "}
                      {new Date(item.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  style={paginationButtonStyle(page === 1)}
                >
                  ← Previous
                </button>
                <div style={pageIndicatorStyle}>
                  Page {page} of {totalPages}
                  <br />
                  <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Showing {displayedPhotos.length} of {photos.length} images
                  </span>
                </div>
                <button
                  onClick={handleNext}
                  disabled={page >= totalPages}
                  style={paginationButtonStyle(page >= totalPages)}
                >
                  Next →
                </button>
              </div>
            )}
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
              🌍
            </div>
            <h3 style={{ color: "#d38312", marginBottom: "1rem" }}>
              Ready to See Earth from Space?
            </h3>
            <p style={{ color: "#888", maxWidth: "500px", margin: "0 auto" }}>
              The EPIC (Earth Polychromatic Imaging Camera) provides spectacular
              views of Earth from the DSCOVR satellite's position at the L1
              Lagrange point. Select a date to view these unique Earth images
              captured from space.
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
          
          @keyframes twinkle {
            0% { opacity: 0.3; }
            100% { opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
};

const labelStyle = {
  display: "block",
  marginBottom: "0.2rem",
  color: "#d38312",
  fontSize: "0.9rem",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "10px",
  border: "1px solid rgba(168, 50, 121, 0.3)",
  background: "rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
  fontSize: "1rem",
  backdropFilter: "blur(10px)",
  transition: "border-color 0.3s ease",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  background: "linear-gradient(135deg, #d38312, #a83279)",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "1rem",
  boxShadow: "0 4px 15px rgba(211, 131, 18, 0.3)",
  transition: "all 0.3s ease",
};

const photoCardStyle = {
  background: "rgba(15, 15, 31, 0.8)",
  borderRadius: "15px",
  border: "1px solid rgba(168, 50, 121, 0.2)",
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
  borderTop: "1px solid rgba(168, 50, 121, 0.1)",
};

const paginationButtonStyle = (disabled) => ({
  background: disabled
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(211, 131, 18, 0.2)",
  color: disabled ? "#444" : "#d38312",
  border: "1px solid rgba(211, 131, 18, 0.3)",
  padding: "0.75rem 1.5rem",
  borderRadius: "10px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  opacity: disabled ? 0.5 : 1,
});

const pageIndicatorStyle = {
  color: "#d38312",
  fontWeight: "bold",
  padding: "1rem 1.5rem",
  background: "rgba(211, 131, 18, 0.1)",
  borderRadius: "10px",
  border: "1px solid rgba(211, 131, 18, 0.2)",
  textAlign: "center",
  minWidth: "150px",
};

export default EpicNasa;
