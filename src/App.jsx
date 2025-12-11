import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Protected from "./components/Protected";
import Home from "./components/Home";
import Hero from "./components/Hero";
import Trending from "./components/Trending";
import Gaming from "./components/Gaming";
import Video from "./components/Video";
import SavedVideos from "./components/SavedVideos";

function App() {
  const [savedVideos, setSavedVideos] = useState([]);

  const handleSaveVideo = (videoObj) => {
    setSavedVideos((prev) => {
      const exists = prev.some((v) => v.id === videoObj.id);

      if (exists) {
        // remove it
        return prev.filter((v) => v.id !== videoObj.id);
      } else {
        // add it
        return [...prev, videoObj];
      }
    });
  };

  console.log(savedVideos);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Protected />}>
        <Route path="/" element={<Home />}>
          <Route index element={<Hero />} />
          <Route path="trending" element={<Trending />} />
          <Route path="gaming" element={<Gaming />} />
          <Route
            path="saved-videos"
            element={<SavedVideos savedVideos={savedVideos} />}
          />
          <Route
            path="videos/:id"
            element={<Video onSave={handleSaveVideo} />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
