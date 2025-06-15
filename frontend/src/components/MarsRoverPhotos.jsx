import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  margin: 2rem auto;
`;

const OpenButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #f093fb, #f5576c);
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
  overflow: hidden;
`;

const PopupContent = styled.div`
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 700px;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 90vh;
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
  background: #f093fb;
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

const PhotosContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 1rem;
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const PhotoCard = styled.div`
  background: #0f0f1f;
  padding: 0.5rem;
  border-radius: 10px;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 5px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 1rem;
`;

const PageButton = styled.button`
  background: #333;
  color: #fff;
  border: 1px solid #666;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: #555;
  }
  &:disabled {
    background: #222;
    cursor: not-allowed;
  }
`;

const MarsRoverPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [sol, setSol] = useState("1000");
  const [camera, setCamera] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

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
      setError(err.message, "Failed to fetch photos");
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
    <Container>
      <OpenButton onClick={() => setOpen(true)}>
        Explore Mars Rover Photos
      </OpenButton>
      {open && (
        <Popup>
          <PopupContent>
            <CloseButton onClick={() => setOpen(false)}>×</CloseButton>
            <h2>Mars Rover Photos</h2>
            <FormGroup>
              <Input
                type="number"
                value={sol}
                onChange={(e) => setSol(e.target.value)}
                placeholder="Sol (e.g. 1000)"
              />
              <Input
                type="text"
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                placeholder="Camera (optional)"
              />
              <FetchButton
                onClick={() => {
                  setPage(1);
                  fetchPhotos(1);
                }}
              >
                {loading ? "Loading..." : "Get Photos"}
              </FetchButton>
            </FormGroup>
            {error && <ErrorText>{error}</ErrorText>}
            <PhotosContainer>
              <PhotosGrid>
                {photos.map((photo) => (
                  <PhotoCard key={photo.id}>
                    <Image src={photo.img_src} alt={photo.id} />
                    <p>{photo.camera.name}</p>
                  </PhotoCard>
                ))}
              </PhotosGrid>
            </PhotosContainer>
            {photos.length > 0 && (
              <Pagination>
                <PageButton onClick={handlePrev} disabled={page === 1}>
                  Previous
                </PageButton>
                <span style={{ color: "#fff" }}>Page {page}</span>
                <PageButton onClick={handleNext}>Next</PageButton>
              </Pagination>
            )}
          </PopupContent>
        </Popup>
      )}
    </Container>
  );
};

export default MarsRoverPhotos;
