import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useNasaSearch } from "../hooks/useNasaSearch";

// Styled Components
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

  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(
    ellipse at center,
    #1a1a2e 0%,
    #16213e 50%,
    #0f0f23 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  overflow: hidden;
`;

const PopupContent = styled.div`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 20px;
  padding: 2rem;
  width: 95vw;
  max-width: 1200px;
  height: 90vh;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  font-family: "Inter", "Arial", sans-serif;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #3b82f6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  margin: 0;
`;

const SearchSection = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  background: rgba(15, 23, 42, 0.8);
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  background: rgba(15, 23, 42, 0.8);
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  option {
    background: #1e293b;
    color: #ffffff;
  }
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  background: rgba(15, 23, 42, 0.8);
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #3b82f6, #7c3aed);
  border: none;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  min-width: 120px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultsSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(100, 116, 139, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.5);
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MediaCard = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const MediaThumbnail = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;
  background: linear-gradient(45deg, #1e293b, #334155);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${MediaCard}:hover & {
    transform: scale(1.05);
  }
`;

const MediaType = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${(props) =>
    props.type === "video"
      ? "rgba(220, 38, 38, 0.9)"
      : props.type === "audio"
      ? "rgba(168, 85, 247, 0.9)"
      : "rgba(34, 197, 94, 0.9)"};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const MediaTitle = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MediaDescription = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MediaMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #64748b;
`;

const ViewButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #059669, #16a34a);
  border: none;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #047857, #15803d);
  }
`;

const DetailModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
`;

const DetailContent = styled.div`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 20px;
  padding: 2rem;
  width: 90vw;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  color: #ffffff;
`;

const DetailImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

const DetailVideo = styled.video`
  width: 100%;
  max-height: 400px;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.div`
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  color: #fca5a5;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 1.1rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${(props) =>
    props.disabled ? "rgba(100, 116, 139, 0.3)" : "rgba(59, 130, 246, 0.8)"};
  border: none;
  border-radius: 6px;
  color: #ffffff;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(59, 130, 246, 1);
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 1.1rem;
`;

// Main component
const ImageAndVideo = ({ onClick }) => (
  <Container>
    <OpenButton onClick={onClick}> Explore NASA Media Library</OpenButton>
  </Container>
);

export const ImageAndVideoModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [keywords, setKeywords] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [center, setCenter] = useState("");
  const [photographer, setPhotographer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [assetUrls, setAssetUrls] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);

  const searchParams = useMemo(() => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (mediaType) params.media_type = mediaType;
    if (keywords) params.keywords = keywords;
    if (yearStart) params.year_start = yearStart;
    if (yearEnd) params.year_end = yearEnd;
    if (center) params.center = center;
    if (photographer) params.photographer = photographer;
    params.page = currentPage.toString();
    params.page_size = "20";
    return params;
  }, [
    searchQuery,
    mediaType,
    keywords,
    yearStart,
    yearEnd,
    center,
    photographer,
    currentPage,
  ]);

  const {
    data: searchResults,
    isFetching,
    refetch,
    error: searchError,
  } = useNasaSearch(searchParams, {
    enabled: shouldFetch && !!searchQuery,
  });

  console.log("isFetching:", isFetching);
  console.log("searchError:", searchError);
  console.log("searchResults:", searchResults);

  const handleSearch = () => {
    setCurrentPage(1);
    if (searchQuery) {
      setShouldFetch(true);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      refetch();
    }
  }, [shouldFetch, refetch]);

  useEffect(() => {
    if (!isOpen) {
      setShouldFetch(false);
      setSearchQuery("");
      setCurrentPage(1);
    }
  }, [isOpen]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchAssetDetails = async (nasa_id) => {
    setDetailLoading(true);
    setDetailError("");
    setAssetUrls([]);

    try {
      const response = await fetch(
        `https://images-api.nasa.gov/asset/${nasa_id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Response is not JSON - the asset may not exist or the API may be unavailable"
        );
      }

      const data = await response.json();

      if (data.collection && data.collection.items) {
        // Filter for actual media files (not metadata)
        const mediaUrls = data.collection.items
          .filter((item) => item.href && !item.href.includes("metadata.json"))
          .map((item) => item.href);
        setAssetUrls(mediaUrls);
      }
    } catch (error) {
      console.error("Error fetching asset details:", error);
      setDetailError(`Failed to load asset details: ${error.message}`);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    fetchAssetDetails(item.data[0].nasa_id);
  };

  const closeDetailModal = () => {
    setSelectedItem(null);
    setAssetUrls([]);
    setDetailError("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getHighQualityUrl = (urls) => {
    // Prefer original, then large, then medium, then small
    const priorities = ["~orig", "~large", "~medium", "~small"];
    for (const priority of priorities) {
      const found = urls.find((url) => url.includes(priority));
      if (found) return found;
    }
    return urls[0]; // Fallback to first available
  };

  if (!isOpen) return null;

  const results = searchResults?.items || [];
  const totalHits = searchResults?.metadata?.total_hits || 0;
  const hasNextPage = searchResults?.links?.some((link) => link.rel === "next");

  return (
    <Popup>
      <PopupContent>
        <CloseButton onClick={onClose}>×</CloseButton>

        <Header>
          <Title>NASA Media Library Explorer</Title>
          <Subtitle>
            Discover thousands of images, videos, and audio from NASA's missions
          </Subtitle>
        </Header>

        <SearchSection>
          <SearchRow>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NASA media library... (e.g., 'Apollo 11', 'Mars rover', 'Hubble')"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <SearchButton onClick={handleSearch} disabled={isFetching}>
              {isFetching ? "Searching..." : "🔍 Search"}
            </SearchButton>
          </SearchRow>

          <FilterRow>
            <Select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
            >
              <option value="">All Media Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
            </Select>

            <SearchInput
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Keywords (comma-separated)"
            />

            <Select value={center} onChange={(e) => setCenter(e.target.value)}>
              <option value="">All NASA Centers</option>
              <option value="JSC">Johnson Space Center</option>
              <option value="KSC">Kennedy Space Center</option>
              <option value="GSFC">Goddard Space Flight Center</option>
              <option value="JPL">Jet Propulsion Laboratory</option>
              <option value="MSFC">Marshall Space Flight Center</option>
              <option value="ARC">Ames Research Center</option>
            </Select>
          </FilterRow>

          <FilterRow>
            <DateInput
              type="number"
              value={yearStart}
              onChange={(e) => setYearStart(e.target.value)}
              placeholder="Start Year (e.g., 1969)"
              min="1900"
              max="2024"
            />

            <DateInput
              type="number"
              value={yearEnd}
              onChange={(e) => setYearEnd(e.target.value)}
              placeholder="End Year (e.g., 2024)"
              min="1900"
              max="2024"
            />

            <SearchInput
              type="text"
              value={photographer}
              onChange={(e) => setPhotographer(e.target.value)}
              placeholder="Photographer name"
            />
          </FilterRow>
        </SearchSection>

        <ResultsSection>
          {searchError && (
            <ErrorMessage>Search failed: {searchError.message}</ErrorMessage>
          )}

          {isFetching && (
            <LoadingSpinner>
              <div>🔄 Searching NASA's media library...</div>
            </LoadingSpinner>
          )}

          {!isFetching && results.length === 0 && searchQuery && (
            <NoResults>
              <div>🔍 No results found</div>
              <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Try different keywords or adjust your filters
              </div>
            </NoResults>
          )}

          {!isFetching && results.length === 0 && !searchQuery && (
            <NoResults>
              <div>🚀 Ready to explore NASA's media library</div>
              <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Enter a search term to discover amazing space content
              </div>
            </NoResults>
          )}

          {results.length > 0 && (
            <>
              <div
                style={{
                  marginBottom: "1rem",
                  color: "#94a3b8",
                  textAlign: "center",
                }}
              >
                Found {totalHits?.toLocaleString()} results • Showing page{" "}
                {currentPage}
              </div>

              <ResultsGrid>
                {results.map((item, index) => {
                  const data = item.data[0];
                  const thumbnail = item.links?.[0]?.href;

                  return (
                    <MediaCard
                      key={index}
                      onClick={() => handleViewDetails(item)}
                    >
                      <MediaThumbnail>
                        {thumbnail ? (
                          <ThumbnailImage src={thumbnail} alt={data.title} />
                        ) : (
                          <div style={{ color: "#64748b", fontSize: "3rem" }}>
                            {data.media_type === "video"
                              ? "🎥"
                              : data.media_type === "audio"
                              ? "🎵"
                              : "🖼️"}
                          </div>
                        )}
                        <MediaType type={data.media_type}>
                          {data.media_type}
                        </MediaType>
                      </MediaThumbnail>

                      <MediaTitle>{data.title}</MediaTitle>
                      <MediaDescription>{data.description}</MediaDescription>

                      <MediaMeta>
                        <span>{data.center || "NASA"}</span>
                        <span>{formatDate(data.date_created)}</span>
                      </MediaMeta>

                      <ViewButton>View Details & High-Res Assets</ViewButton>
                    </MediaCard>
                  );
                })}
              </ResultsGrid>

              <Pagination>
                <PageButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || isFetching}
                >
                  ← Previous
                </PageButton>

                <span style={{ color: "#94a3b8" }}>Page {currentPage}</span>

                <PageButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage || isFetching}
                >
                  Next →
                </PageButton>
              </Pagination>
            </>
          )}
        </ResultsSection>

        {selectedItem && (
          <DetailModal onClick={closeDetailModal}>
            <DetailContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={closeDetailModal}>×</CloseButton>

              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>
                  {selectedItem.data[0].title}
                </h2>
                <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                  {selectedItem.data[0].center} •{" "}
                  {formatDate(selectedItem.data[0].date_created)}
                </div>
              </div>

              {detailLoading && (
                <LoadingSpinner>
                  Loading high-resolution assets...
                </LoadingSpinner>
              )}

              {detailError && <ErrorMessage>{detailError}</ErrorMessage>}

              {assetUrls.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  {selectedItem.data[0].media_type === "image" && (
                    <DetailImage
                      src={getHighQualityUrl(assetUrls)}
                      alt={selectedItem.data[0].title}
                    />
                  )}
                  {selectedItem.data[0].media_type === "video" && (
                    <DetailVideo controls>
                      <source src={getHighQualityUrl(assetUrls)} />
                      Your browser does not support the video tag.
                    </DetailVideo>
                  )}
                  {selectedItem.data[0].media_type === "audio" && (
                    <audio
                      controls
                      style={{ width: "100%", marginBottom: "1rem" }}
                    >
                      <source src={getHighQualityUrl(assetUrls)} />
                      Your browser does not support the audio tag.
                    </audio>
                  )}
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>
                  Description
                </h3>
                <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>
                  {selectedItem.data[0].description}
                </p>
              </div>

              {selectedItem.data[0].keywords &&
                selectedItem.data[0].keywords.length > 0 && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>
                      Keywords
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {selectedItem.data[0].keywords.map((keyword, index) => (
                        <span
                          key={index}
                          style={{
                            background: "rgba(59, 130, 246, 0.2)",
                            color: "#93c5fd",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {assetUrls.length > 0 && (
                <div>
                  <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>
                    Available Assets
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {assetUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#3b82f6",
                          textDecoration: "none",
                          padding: "0.5rem",
                          background: "rgba(59, 130, 246, 0.1)",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                        }}
                      >
                        📎 {url.split("/").pop()}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </DetailContent>
          </DetailModal>
        )}
      </PopupContent>
    </Popup>
  );
};

export default ImageAndVideo;
