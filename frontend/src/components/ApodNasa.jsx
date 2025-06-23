import { useState } from "react";
import styled from "styled-components";
import { useApod } from "../hooks/useApod";

const Container = styled.div`
  text-align: center;
  margin: 1rem 0;
`;

const OpenButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
  overflow-y: auto;
`;

const PopupContent = styled.div`
  background: linear-gradient(145deg, #1e293b 0%, #334155 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 2.5rem;
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  color: #f8fafc;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(148, 163, 184, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.5);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 50%;
  font-size: 1.5rem;
  color: #fca5a5;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    color: #fee2e2;
    transform: scale(1.1);
  }
`;

const Title = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #f1f5f9;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0 0 2rem 0;
  color: #94a3b8;
  text-align: center;
  font-size: 0.9rem;
`;

const InputContainer = styled.div`
  margin-bottom: 2rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #cbd5e1;
  font-weight: 500;
  font-size: 0.9rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: end;
`;

const DateInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.5);
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`;

const FetchButton = styled.button`
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  border: none;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  min-width: 120px;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);

  &:hover {
    background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DateInfo = styled.p`
  margin-top: 0.5rem;
  color: #64748b;
  font-size: 0.75rem;
  font-style: italic;
`;

const ErrorText = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const Result = styled.div`
  margin-top: 2rem;
`;

const ResultTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

const ResultDate = styled.p`
  color: #94a3b8;
  text-align: center;
  margin: 0 0 1.5rem 0;
  font-weight: 500;
`;

const Copyright = styled.p`
  color: #64748b;
  text-align: center;
  margin: 0.5rem 0 1.5rem 0;
  font-size: 0.8rem;
  font-style: italic;
`;

const MediaContainer = styled.div`
  background: rgba(15, 23, 42, 0.3);
  border-radius: 15px;
  padding: 1rem;
  margin: 1.5rem 0;
  border: 1px solid rgba(148, 163, 184, 0.1);
`;

const Image = styled.img`
  width: 100%;
  max-height: 450px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
`;

const Video = styled.iframe`
  width: 100%;
  height: 350px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
`;

const ExplanationContainer = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const ExplanationTitle = styled.h4`
  color: #94a3b8;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
`;

const Explanation = styled.p`
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const HDLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);

  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  }
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

export const ApodNasa = ({ onClick }) => {
  return (
    <Container>
      <OpenButton onClick={onClick}> Explore APOD</OpenButton>
    </Container>
  );
};

export const ApodNasaModal = ({ isOpen, onClose }) => {
  const [date, setDate] = useState("");

  const { data, isLoading, error, refetch, isFetching } = useApod(date, {
    enabled: false,
  }); // Fetch manually

  if (!isOpen) return null;

  // Get today's date for max attribute
  const today = new Date().toISOString().split("T")[0];
  // APOD started on June 16, 1995
  const minDate = "1995-06-16";

  return (
    <Popup>
      <PopupContent>
        <CloseButton onClick={onClose}>×</CloseButton>

        <Title>Astronomy Picture of the Day</Title>
        <Subtitle>
          Discover the cosmos through NASA's daily featured image
        </Subtitle>

        <InputContainer>
          <InputLabel>Select Date</InputLabel>
          <InputGroup>
            <DateInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              max={today}
            />
            <FetchButton onClick={refetch} disabled={isFetching || !date}>
              {isFetching ? (
                <>
                  <LoadingSpinner />
                  Loading...
                </>
              ) : (
                "Get Picture"
              )}
            </FetchButton>
          </InputGroup>
          <DateInfo>Available from June 16, 1995 to today</DateInfo>
        </InputContainer>

        {error && (
          <ErrorText>
            <strong>Error:</strong> {error.message}
          </ErrorText>
        )}

        {data && (
          <Result>
            <ResultTitle>{data.title}</ResultTitle>
            <ResultDate>
              {new Date(data.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </ResultDate>
            {data.copyright && <Copyright>© {data.copyright}</Copyright>}

            <MediaContainer>
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
            </MediaContainer>

            <ExplanationContainer>
              <ExplanationTitle>Explanation</ExplanationTitle>
              <Explanation>{data.explanation}</Explanation>
            </ExplanationContainer>

            {data.hdurl && data.media_type === "image" && (
              <CenterContainer>
                <HDLink
                  href={data.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔗 View HD Version
                </HDLink>
              </CenterContainer>
            )}
          </Result>
        )}
      </PopupContent>
    </Popup>
  );
};

export default ApodNasa;
