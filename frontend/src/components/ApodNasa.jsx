import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  margin: 2rem auto;
`;

const OpenButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #00ffff, #0080ff);
  color: black;
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
  max-width: 600px;
  color: #fff;
  position: relative;
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

const DateInput = styled.input`
  padding: 0.5rem;
  margin: 1rem 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

const FetchButton = styled.button`
  padding: 0.7rem 1.5rem;
  background: #00ffff;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
`;

const ErrorText = styled.p`
  color: #ff5050;
  margin-top: 1rem;
`;

const Result = styled.div`
  margin-top: 2rem;
  text-align: left;
`;

const Image = styled.img`
  width: 100%;
  max-height: 400px;
  border-radius: 10px;
  margin: 1rem 0;
`;

const Video = styled.iframe`
  width: 100%;
  max-height: 400px;
  border-radius: 10px;
  margin: 1rem 0;
`;

const Explanation = styled.p`
  font-size: 0.9rem;
  color: #ddd;
`;

const ApodNasa = () => {
  const [data, setData] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const fetchApod = async () => {
    if (!date) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/nasa/apod?date=${date}`
      );
      const json = await res.json();
      if (json.code) throw new Error(json.msg || "Failed to fetch");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <OpenButton onClick={() => setOpen(true)}>Explore APOD</OpenButton>
      {open && (
        <Popup>
          <PopupContent>
            <CloseButton onClick={() => setOpen(false)}>×</CloseButton>
            <h2>Astronomy Picture of the Day</h2>
            <DateInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <FetchButton onClick={fetchApod}>
              {loading ? "Loading..." : "Get Picture"}
            </FetchButton>
            {error && <ErrorText>{error}</ErrorText>}
            {data && (
              <Result>
                <h3>{data.title}</h3>
                <p>{data.date}</p>
                {data.media_type === "image" ? (
                  <Image src={data.url} alt={data.title} />
                ) : (
                  <Video
                    src={data.url}
                    title={data.title}
                    frameBorder="0"
                    allowFullScreen
                  />
                )}
                <Explanation>{data.explanation}</Explanation>
              </Result>
            )}
          </PopupContent>
        </Popup>
      )}
    </Container>
  );
};

export default ApodNasa;
