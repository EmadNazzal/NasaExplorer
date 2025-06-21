import ApodNasa from "./components/ApodNasa";
import EpicNasa from "./components/EpicNasa";
import FirstPage from "./components/FirstPage";
import ImageAndVideo from "./components/ImageAndVideo";
import MarsRoverPhotos from "./components/MarsRoverPhotos";
import NearEarth from "./components/NearEarth";
import { createGlobalStyle } from "styled-components";

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

function App() {
  return (
    <>
      <GlobalStyle />

      <FirstPage />
      {/* <ApodNasa />
      <MarsRoverPhotos />
      <EpicNasa />
      <ImageAndVideo />
      <NearEarth /> */}
    </>
  );
}

export default App;
