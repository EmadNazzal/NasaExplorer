import React, { useState } from "react";
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
import styled from "styled-components";

const Container = styled.div`
  padding: 1rem;
  z-index: 99;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 80vw;
  max-height: 90vh;
  overflow: auto;
  z-index: 99;
`;

const StyledButton = styled.button`
  background-color: black;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #1f1f1f;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ChartCard = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Header = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c"];

export default function NearEarth() {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [neoData, setNeoData] = useState([]);

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

  const processBarData = () => {
    return neoData.map((obj) => ({
      name: obj.name,
      diameter: obj.estimated_diameter.kilometers.estimated_diameter_max,
    }));
  };

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

  const processScatterData = () => {
    return neoData.map((obj) => {
      const approach = obj.close_approach_data[0];
      return {
        name: obj.name,
        velocity: parseFloat(approach.relative_velocity.kilometers_per_hour),
        distance: parseFloat(approach.miss_distance.kilometers),
      };
    });
  };

  return (
    <Container>
      <StyledButton onClick={() => setOpen(true)}>
        Explore Near-Earth Objects
      </StyledButton>
      {open && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setOpen(false)}>&times;</CloseButton>
            <Header>NEO Data Explorer</Header>

            <InputRow>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />
              <StyledButton onClick={fetchNEOs}>Fetch Data</StyledButton>
            </InputRow>

            {neoData.length > 0 && (
              <ChartGrid>
                <ChartCard>
                  <Title>Asteroid Sizes (km)</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={processBarData()}>
                      <XAxis dataKey="name" hide />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="diameter" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard>
                  <Title>Hazardous vs Non-Hazardous</Title>
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
                </ChartCard>

                <ChartCard style={{ gridColumn: "span 2" }}>
                  <Title>Velocity vs Miss Distance</Title>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart>
                      <XAxis
                        type="number"
                        dataKey="velocity"
                        name="Velocity (km/h)"
                      />
                      <YAxis
                        type="number"
                        dataKey="distance"
                        name="Miss Distance (km)"
                      />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter
                        name="NEOs"
                        data={processScatterData()}
                        fill="#82ca9d"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartCard>
              </ChartGrid>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
