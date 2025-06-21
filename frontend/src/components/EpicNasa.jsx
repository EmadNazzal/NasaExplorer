import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a2e;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, rgb(255, 107, 107), rgb(255, 217, 61), rgb(107, 207, 127), rgb(78, 205, 196), rgb(69, 183, 209));
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:hover {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
`;

const Container = styled.div`
  text-align: center;
  margin: 1rem 0;
`;

const OpenButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 10, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
  overflow-y: auto;
`;

const PopupContent = styled.div`
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 800px;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 90vh;
`;

const ScrollWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 1rem;
  padding-right: 0.5rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ff5050;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  color: white;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
`;

const FormGroup = styled.div`
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const FetchButton = styled.button`
  padding: 0.7rem 1.5rem;
  background: #00f2fe;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  color: #000;
`;

const ErrorText = styled.p`
  color: #ff5050;
  margin-top: 1rem;
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const PhotoCard = styled.div`
  background: #0f0f1f;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  display: block;
`;

const CaptionOverlay = styled.div`
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.85rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  ${PhotoCard}:hover & {
    opacity: 1;
  }
`;

const EpicNasa = ({ onClick }) => (
  <Container>
    <OpenButton onClick={onClick}>Explore EPIC Data</OpenButton>
  </Container>
);

export const EpicNasaModal = ({ isOpen, onClose }) => {
  const [photos, setPhotos] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPhotos = async () => {
    setLoading(true);
    setError("");
    setPhotos([]);
    try {
      const endpoint = date
        ? `http://localhost:5000/api/nasa/epic?date=${date}`
        : "http://localhost:5000/api/nasa/epic";
      const res = await fetch(endpoint);
      const json = await res.json();
      setPhotos(json || []);
    } catch (err) {
      setError(err.message, "Failed to fetch EPIC images");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <GlobalStyle />
      <Popup>
        <PopupContent>
          <CloseButton onClick={onClose}>×</CloseButton>
          <h2>Earth Polychromatic Imaging Camera</h2>
          <FormGroup>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <FetchButton onClick={fetchPhotos}>
              {loading ? "Loading..." : "Get Images"}
            </FetchButton>
          </FormGroup>
          {error && <ErrorText>{error}</ErrorText>}
          <ScrollWrapper>
            <PhotosGrid>
              {photos.map((item, index) => (
                <PhotoCard key={index}>
                  <Image
                    src={`https://epic.gsfc.nasa.gov/archive/natural/${item.date
                      .split(" ")[0]
                      .replaceAll("-", "/")}/png/${item.image}.png`}
                    alt={item.caption}
                  />
                  <CaptionOverlay>{item.caption}</CaptionOverlay>
                </PhotoCard>
              ))}
            </PhotosGrid>
          </ScrollWrapper>
        </PopupContent>
      </Popup>
    </>
  );
};

export default EpicNasa;
