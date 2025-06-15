import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  margin: 2rem auto;
`;

const OpenButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #d38312, #a83279);
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
  max-width: 900px;
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
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 300px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #d38312;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const MediaCard = styled.div`
  background: #0f0f1f;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  text-align: left;
`;

const Thumbnail = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

const ImageAndVideo = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [asset, setAsset] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [captions, setCaptions] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(
        `http://localhost:5000/api/nasa/search?q=${query}`
      );
      const data = await res.json();
      setResults(data.collection.items || []);
    } catch (err) {
      setError(err.message, "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (nasa_id) => {
    setSelectedId(nasa_id);
    setAsset(null);
    setMetadata(null);
    setCaptions(null);
    try {
      const assetRes = await fetch(
        `http://localhost:5000/api/nasa/asset/${nasa_id}`
      );
      const assetData = await assetRes.json();
      setAsset(assetData);

      const metadataRes = await fetch(
        `http://localhost:5000/api/nasa/metadata/${nasa_id}`
      );
      const metadataData = await metadataRes.json();
      setMetadata(metadataData);

      const captionsRes = await fetch(
        `http://localhost:5000/api/nasa/captions/${nasa_id}`
      );
      const captionsData = await captionsRes.json();
      setCaptions(captionsData);
    } catch (err) {
      setError(err.message, "Failed to retrieve asset details");
    }
  };

  return (
    <Container>
      <OpenButton onClick={() => setOpen(true)}>
        Explore NASA Media Library
      </OpenButton>
      {open && (
        <Popup>
          <PopupContent>
            <CloseButton onClick={() => setOpen(false)}>×</CloseButton>
            <h2>NASA Image & Video Library</h2>
            <FormGroup>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search NASA media..."
              />
              <Button onClick={handleSearch}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </FormGroup>
            {error && <p style={{ color: "#ff5050" }}>{error}</p>}
            <ScrollWrapper>
              {results.map((item, i) => (
                <MediaCard key={i}>
                  {item.links && item.links[0]?.href && (
                    <Thumbnail src={item.links[0].href} alt="thumb" />
                  )}
                  <h4>{item.data[0].title}</h4>
                  <p>{item.data[0].description}</p>
                  <Button onClick={() => fetchDetails(item.data[0].nasa_id)}>
                    View Details
                  </Button>
                </MediaCard>
              ))}
              {selectedId && asset && (
                <MediaCard>
                  <h4>Asset Manifest for {selectedId}</h4>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(asset, null, 2)}
                  </pre>
                </MediaCard>
              )}
              {metadata && (
                <MediaCard>
                  <h4>Metadata</h4>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(metadata, null, 2)}
                  </pre>
                </MediaCard>
              )}
              {captions && (
                <MediaCard>
                  <h4>Captions</h4>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(captions, null, 2)}
                  </pre>
                </MediaCard>
              )}
            </ScrollWrapper>
          </PopupContent>
        </Popup>
      )}
    </Container>
  );
};

export default ImageAndVideo;
