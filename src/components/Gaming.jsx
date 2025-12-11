import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Loader2, AlertCircle, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const Gaming = () => {
  const [videos, setVideos] = useState([]);
  const [apiStatus, setApiStatus] = useState("initial");

  const fetchGamingVideos = async () => {
    setApiStatus("loading");

    const jwtToken = Cookies.get("jwt_token");
    const url = `https://apis.ccbp.in/videos/gaming`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    };

    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const data = await response.json();
        const updatedData = data.videos.map((eachVideo) => ({
          id: eachVideo.id,
          title: eachVideo.title,
          thumbnailUrl: eachVideo.thumbnail_url,
          viewCount: eachVideo.view_count,
        }));

        setVideos(updatedData);
        setApiStatus("success");
      } else {
        setApiStatus("failure");
      }
    } catch (error) {
      console.error("Error fetching gaming videos:", error);
      setApiStatus("failure");
    }
  };

  useEffect(() => {
    fetchGamingVideos();
  }, []);

  const handleRetry = () => {
    fetchGamingVideos();
  };

  const formatViews = (count) => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return count;
  };

  const renderLoadingView = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        <p className="text-gray-600">Loading gaming videos...</p>
      </div>
    </div>
  );

  const renderFailureView = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="bg-red-50 p-4 rounded-full">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-gray-900">Oops! Something Went Wrong</h2>
        <p className="text-gray-600">
          We are having some trouble to complete your request. Please try again.
        </p>
        <button
          onClick={handleRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const renderVideosView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <Link
          to={`/videos/${video.id}`}
          key={video.id}
          className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="relative aspect-video bg-gray-200">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4">
            <h3 className="text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
              {video.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {formatViews(video.viewCount)} Watching Worldwide
            </p>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (apiStatus) {
      case "loading":
        return renderLoadingView();
      case "failure":
        return renderFailureView();
      case "success":
        return renderVideosView();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-3 rounded-full">
            <Gamepad2 className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-gray-900">Gaming</h1>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default Gaming;
