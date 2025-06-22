import React, { useState } from "react";
import AnimatedStarfield from "./AnimatedStarfield";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import { useNearEarth } from "../hooks/useNearEarth";

// Professional color palette
const PROFESSIONAL_COLORS = {
  primary: "#2563eb", // Deep blue
  secondary: "#7c3aed", // Purple
  accent: "#059669", // Emerald
  warning: "#dc2626", // Red
  info: "#0891b2", // Cyan
  success: "#16a34a", // Green
  gradient1: "#3b82f6", // Blue
  gradient2: "#8b5cf6", // Violet
};

const CHART_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#0891b2",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#0d9488",
  "#be123c",
  "#7c2d12",
  "#4338ca",
  "#166534",
  "#b91c1c",
  "#1e40af",
];

const HAZARD_COLORS = {
  hazardous: "#dc2626",
  nonHazardous: "#16a34a",
};

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

  const {
    data: neoData = [],
    error,
    isFetching,
    refetch,
  } = useNearEarth(
    { start_date: startDate, end_date: endDate },
    { enabled: false }
  );

  if (!isOpen) return null;

  const handleFetch = () => {
    if (!startDate || !endDate) return;
    refetch();
  };

  // Enhanced data processing functions
  const processDiameterData = () =>
    neoData.map((obj, index) => ({
      name: obj.name.length > 15 ? obj.name.substring(0, 15) + "..." : obj.name,
      fullName: obj.name,
      minDiameter: obj.estimated_diameter.kilometers.estimated_diameter_min,
      maxDiameter: obj.estimated_diameter.kilometers.estimated_diameter_max,
      avgDiameter:
        (obj.estimated_diameter.kilometers.estimated_diameter_min +
          obj.estimated_diameter.kilometers.estimated_diameter_max) /
        2,
      isHazardous: obj.is_potentially_hazardous_asteroid,
      index: index + 1,
    }));

  const processHazardData = () => {
    const hazardous = neoData.filter(
      (obj) => obj.is_potentially_hazardous_asteroid
    ).length;
    const nonHazardous = neoData.length - hazardous;
    return [
      {
        name: "Potentially Hazardous",
        value: hazardous,
        percentage: ((hazardous / neoData.length) * 100).toFixed(1),
      },
      {
        name: "Non-Hazardous",
        value: nonHazardous,
        percentage: ((nonHazardous / neoData.length) * 100).toFixed(1),
      },
    ];
  };

  const processVelocityDistanceData = () =>
    neoData.map((obj, index) => {
      const approach = obj.close_approach_data[0];
      return {
        name:
          obj.name.length > 10 ? obj.name.substring(0, 10) + "..." : obj.name,
        fullName: obj.name,
        velocity: parseFloat(approach.relative_velocity.kilometers_per_hour),
        distance: parseFloat(approach.miss_distance.kilometers),
        diameter: obj.estimated_diameter.kilometers.estimated_diameter_max,
        isHazardous: obj.is_potentially_hazardous_asteroid,
        index: index + 1,
      };
    });

  const processApproachDateData = () => {
    const dateGroups = {};
    neoData.forEach((obj) => {
      const date = obj.close_approach_data[0].close_approach_date;
      if (!dateGroups[date]) {
        dateGroups[date] = { date, count: 0, hazardous: 0, totalDiameter: 0 };
      }
      dateGroups[date].count++;
      if (obj.is_potentially_hazardous_asteroid) dateGroups[date].hazardous++;
      dateGroups[date].totalDiameter +=
        obj.estimated_diameter.kilometers.estimated_diameter_max;
    });

    return Object.values(dateGroups).map((group) => ({
      ...group,
      avgDiameter: group.totalDiameter / group.count,
      nonHazardous: group.count - group.hazardous,
    }));
  };

  const processSizeClassification = () => {
    const classifications = {
      "Small (< 0.1 km)": 0,
      "Medium (0.1-1 km)": 0,
      "Large (1-10 km)": 0,
      "Very Large (> 10 km)": 0,
    };

    neoData.forEach((obj) => {
      const size = obj.estimated_diameter.kilometers.estimated_diameter_max;
      if (size < 0.1) classifications["Small (< 0.1 km)"]++;
      else if (size < 1) classifications["Medium (0.1-1 km)"]++;
      else if (size < 10) classifications["Large (1-10 km)"]++;
      else classifications["Very Large (> 10 km)"]++;
    });

    return Object.entries(classifications).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const processSpeedAnalysis = () => {
    const speedRanges = {
      "Slow (< 20k km/h)": 0,
      "Moderate (20-40k km/h)": 0,
      "Fast (40-60k km/h)": 0,
      "Very Fast (> 60k km/h)": 0,
    };

    neoData.forEach((obj) => {
      const speed = parseFloat(
        obj.close_approach_data[0].relative_velocity.kilometers_per_hour
      );
      if (speed < 20000) speedRanges["Slow (< 20k km/h)"]++;
      else if (speed < 40000) speedRanges["Moderate (20-40k km/h)"]++;
      else if (speed < 60000) speedRanges["Fast (40-60k km/h)"]++;
      else speedRanges["Very Fast (> 60k km/h)"]++;
    });

    return Object.entries(speedRanges).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            padding: "12px",
            border: "1px solid rgba(100, 116, 139, 0.3)",
            borderRadius: "8px",
            backdropFilter: "blur(10px)",
            color: "#ffffff",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: "0", color: entry.color }}>
              {`${entry.name}: ${
                typeof entry.value === "number"
                  ? entry.value.toFixed(2)
                  : entry.value
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            padding: "12px",
            border: "1px solid rgba(100, 116, 139, 0.3)",
            borderRadius: "8px",
            backdropFilter: "blur(10px)",
            color: "#ffffff",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
            {data.fullName}
          </p>
          <p style={{ margin: "0", color: "#3b82f6" }}>
            Velocity: {data.velocity.toLocaleString()} km/h
          </p>
          <p style={{ margin: "0", color: "#059669" }}>
            Miss Distance: {data.distance.toLocaleString()} km
          </p>
          <p style={{ margin: "0", color: "#7c3aed" }}>
            Diameter: {data.diameter.toFixed(3)} km
          </p>
          <p
            style={{
              margin: "0",
              color: data.isHazardous ? "#dc2626" : "#16a34a",
            }}
          >
            {data.isHazardous ? "Potentially Hazardous" : "Non-Hazardous"}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            padding: "12px",
            border: "1px solid rgba(100, 116, 139, 0.3)",
            borderRadius: "8px",
            backdropFilter: "blur(10px)",
            color: "#ffffff",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontWeight: "bold",
              color: data.color,
            }}
          >
            {data.payload.name}
          </p>
          <p style={{ margin: "0" }}>Count: {data.value}</p>
          <p style={{ margin: "0" }}>Percentage: {data.payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

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
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(100, 116, 139, 0.3)",
          borderRadius: "20px",
          padding: "2rem",
          width: "90vw",
          maxHeight: "95vh",
          overflow: "auto",
          position: "relative",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
            border: "none",
            borderRadius: "50%",
            fontSize: "1.5rem",
            color: "white",
            width: "2.5rem",
            height: "2.5rem",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3)",
            transition: "all 0.3s ease",
          }}
        >
          ×
        </button>

        <h1
          style={{
            background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          Near-Earth Objects Analytics Dashboard
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: "2rem",
            fontSize: "1.1rem",
          }}
        >
          Comprehensive analysis of NASA's Near-Earth Object data (Maximum 7-day
          range)
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={handleFetch}
            style={buttonStyle}
            disabled={isFetching}
          >
            {isFetching ? "🔄 Analyzing..." : "🔍 Analyze NEO Data"}
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "8px",
              padding: "1rem",
              textAlign: "center",
              color: "#fca5a5",
              marginBottom: "2rem",
            }}
          >
            Error: {error.message}
          </div>
        )}

        {neoData.length > 0 && (
          <>
            {/* Summary Statistics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "3rem",
              }}
            >
              <div style={statCard}>
                <h3 style={statTitle}>Total Objects</h3>
                <p style={statValue}>{neoData.length}</p>
              </div>
              <div style={statCard}>
                <h3 style={statTitle}>Potentially Hazardous</h3>
                <p style={{ ...statValue, color: "#dc2626" }}>
                  {
                    neoData.filter(
                      (obj) => obj.is_potentially_hazardous_asteroid
                    ).length
                  }
                </p>
              </div>
              <div style={statCard}>
                <h3 style={statTitle}>Largest Diameter</h3>
                <p style={statValue}>
                  {Math.max(
                    ...neoData.map(
                      (obj) =>
                        obj.estimated_diameter.kilometers.estimated_diameter_max
                    )
                  ).toFixed(3)}{" "}
                  km
                </p>
              </div>
              <div style={statCard}>
                <h3 style={statTitle}>Fastest Velocity</h3>
                <p style={statValue}>
                  {Math.max(
                    ...neoData.map((obj) =>
                      parseFloat(
                        obj.close_approach_data[0].relative_velocity
                          .kilometers_per_hour
                      )
                    )
                  ).toLocaleString()}{" "}
                  km/h
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gap: "3rem" }}>
              {/* Diameter Analysis */}
              <div style={chartContainer}>
                <h3 style={chartTitle}>🪨 Asteroid Diameter Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart
                    data={processDiameterData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="index"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickFormatter={(value) => `#${value}`}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="minDiameter"
                      fill="#3b82f6"
                      name="Min Diameter (km)"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="maxDiameter"
                      fill="#7c3aed"
                      name="Max Diameter (km)"
                      radius={[2, 2, 0, 0]}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Hazard Assessment */}
              <div style={chartContainer}>
                <h3 style={chartTitle}>⚠️ Hazard Assessment Distribution</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={processHazardData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      paddingAngle={5}
                      label={({ name, percentage }) =>
                        `${name}: ${percentage}%`
                      }
                      labelLine={false}
                    >
                      {processHazardData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name.includes("Hazardous") &&
                            !entry.name.includes("Non")
                              ? HAZARD_COLORS.hazardous
                              : HAZARD_COLORS.nonHazardous
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Velocity vs Distance Analysis */}
              <div style={chartContainer}>
                <h3 style={chartTitle}>
                  🚀 Velocity vs Miss Distance Correlation
                </h3>
                <ResponsiveContainer width="100%" height={450}>
                  <ScatterChart
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis
                      type="number"
                      dataKey="velocity"
                      name="Velocity"
                      unit=" km/h"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      type="number"
                      dataKey="distance"
                      name="Miss Distance"
                      unit=" km"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(1)}M`
                      }
                    />
                    <Tooltip content={<ScatterTooltip />} />
                    <Legend />
                    <Scatter
                      data={processVelocityDistanceData().filter(
                        (d) => !d.isHazardous
                      )}
                      fill="#16a34a"
                      name="Non-Hazardous"
                      r={6}
                    />
                    <Scatter
                      data={processVelocityDistanceData().filter(
                        (d) => d.isHazardous
                      )}
                      fill="#dc2626"
                      name="Potentially Hazardous"
                      r={8}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Approach Date Timeline */}
              <div style={chartContainer}>
                <h3 style={chartTitle}>📅 Approach Date Timeline</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart
                    data={processApproachDateData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="nonHazardous"
                      stackId="1"
                      stroke="#16a34a"
                      fill="#16a34a"
                      fillOpacity={0.8}
                      name="Non-Hazardous"
                    />
                    <Area
                      type="monotone"
                      dataKey="hazardous"
                      stackId="1"
                      stroke="#dc2626"
                      fill="#dc2626"
                      fillOpacity={0.8}
                      name="Potentially Hazardous"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Size Classification */}
              <div style={chartContainer}>
                <h3 style={chartTitle}>📏 Size Classification Distribution</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={processSizeClassification()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      fill="#059669"
                      radius={[4, 4, 0, 0]}
                      name="Count"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Speed Analysis */}
              <div style={chartContainer}>
                <h3 style={chartTitle}>⚡ Speed Distribution Analysis</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={processSpeedAnalysis()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                      }
                      labelLine={false}
                    >
                      {processSpeedAnalysis().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "1px solid rgba(100, 116, 139, 0.3)",
  background: "rgba(15, 23, 42, 0.8)",
  color: "#ffffff",
  fontSize: "1rem",
  backdropFilter: "blur(10px)",
  outline: "none",
  transition: "all 0.3s ease",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
  border: "none",
  fontWeight: "600",
  cursor: "pointer",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "1rem",
  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
  transition: "all 0.3s ease",
  outline: "none",
};

const chartTitle = {
  textAlign: "center",
  color: "#ffffff",
  marginBottom: "1.5rem",
  fontSize: "1.25rem",
  fontWeight: "600",
};

const chartContainer = {
  background: "rgba(15, 23, 42, 0.6)",
  border: "1px solid rgba(100, 116, 139, 0.2)",
  borderRadius: "12px",
  padding: "1.5rem",
  backdropFilter: "blur(10px)",
};

const statCard = {
  background: "rgba(15, 23, 42, 0.8)",
  border: "1px solid rgba(100, 116, 139, 0.3)",
  borderRadius: "12px",
  padding: "1.5rem",
  textAlign: "center",
  backdropFilter: "blur(10px)",
};

const statTitle = {
  color: "#94a3b8",
  fontSize: "0.875rem",
  fontWeight: "500",
  margin: "0 0 0.5rem 0",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const statValue = {
  color: "#ffffff",
  fontSize: "1.875rem",
  fontWeight: "bold",
  margin: "0",
};

export default NearEarth;
