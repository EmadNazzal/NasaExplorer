import React, { useState } from "react";
import AnimatedStarfield from "./AnimatedStarfield";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";

const COLORS = ["#64ffda", "#667eea", "#f093fb", "#ffd700", "#ff6b6b"];

const NearEarth = ({ onClick }) => (
  <div style={{ padding: "1rem", textAlign: "center" }}>
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
        fontFamily: "'Inter', 'Arial', sans-serif",
      }}
    >
      Explore Near-Earth Objects
    </button>
  </div>
);

export const NearEarthModal = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [neoData, setNeoData] = useState([]);

  if (!isOpen) return null;

  const fetchNEOs = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/nasa/neo?start_date=${startDate}&end_date=${endDate}`
      );
      const data = await res.json();
      const objects = Object.values(data.near_earth_objects).flat();
      setNeoData(objects);
    } catch (error) {
      console.error("Error fetching NEO data", error);
    }
  };

  const processBarData = () =>
    neoData.map((obj) => ({
      name: obj.name,
      diameter: obj.estimated_diameter.kilometers.estimated_diameter_max,
    }));

  const processPieData = () => {
    const hazardous = neoData.filter(
      (obj) => obj.is_potentially_hazardous_asteroid
    ).length;
    const nonHazardous = neoData.length - hazardous;
    return [
      { name: "Hazardous", value: hazardous },
      { name: "Non-Hazardous", value: nonHazardous },
    ];
  };

  const processScatterData = () =>
    neoData.map((obj) => {
      const approach = obj.close_approach_data[0];
      return {
        name: obj.name,
        velocity: parseFloat(approach.relative_velocity.kilometers_per_hour),
        distance: parseFloat(approach.miss_distance.kilometers),
      };
    });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        overflow: "hidden",
        fontFamily: "'Inter', 'Arial', sans-serif",
      }}
    >
      <AnimatedStarfield />
      <div
        style={{
          background: "rgba(26, 26, 46, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(100, 255, 218, 0.2)",
          borderRadius: "20px",
          padding: "2rem",
          width: "80vw",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          boxShadow:
            "0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
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
            fontSize: "1.5rem",
            color: "white",
            width: "2.5rem",
            height: "2.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(255, 107, 107, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          ×
        </button>

        <h1
          style={{
            background: "linear-gradient(135deg, #64ffda, #1de9b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          NEO Data Explorer
        </h1>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
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
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
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
            onClick={fetchNEOs}
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
            }}
          >
            🔍 Fetch Data
          </button>
        </div>

        {neoData.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2rem",
            }}
          >
            <div>
              <h3 style={{ textAlign: "center", color: "#64ffda" }}>
                🪨 Asteroid Sizes (km)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processBarData()}>
                  <XAxis dataKey="name" hide />
                  <YAxis stroke="#64ffda" />
                  <Tooltip />
                  <Bar dataKey="diameter" fill="#64ffda" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 style={{ textAlign: "center", color: "#64ffda" }}>
                ⚠️ Hazardous vs Non-Hazardous
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={processPieData()}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >
                    {processPieData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <h3 style={{ textAlign: "center", color: "#64ffda" }}>
                🚀 Velocity vs Miss Distance
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <XAxis
                    type="number"
                    dataKey="velocity"
                    name="Velocity (km/h)"
                    stroke="#64ffda"
                  />
                  <YAxis
                    type="number"
                    dataKey="distance"
                    name="Miss Distance (km)"
                    stroke="#64ffda"
                  />
                  <Tooltip />
                  <Scatter
                    name="NEOs"
                    data={processScatterData()}
                    fill="#64ffda"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearEarth;
