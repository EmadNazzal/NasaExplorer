import { useState } from "react";
import styled from "styled-components";
import { useApod } from "../hooks/useApod";
const Container = styled.div`
  text-align: center;
  margin: 1rem 0;
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

export const ApodNasa = ({ onClick }) => {
  return (
    <Container>
      <OpenButton onClick={onClick}>Explore APOD</OpenButton>
    </Container>
  );
};

export const ApodNasaModal = ({ isOpen, onClose }) => {
  const [date, setDate] = useState("");

  const { data, isLoading, error, refetch, isFetching } = useApod(date, {
    enabled: false,
  }); // Fetch manually

  if (!isOpen) return null;

  return (
    <Popup>
      <PopupContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Astronomy Picture of the Day</h2>

        <DateInput
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <FetchButton onClick={refetch}>
          {isFetching ? "Loading..." : "Get Picture"}
        </FetchButton>

        {error && <ErrorText>{error.message}</ErrorText>}

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
  );
};

export default ApodNasa;
