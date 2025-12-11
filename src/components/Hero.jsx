import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const Hero = () => {
  const [videos, setVideos] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiStatus, setApiStatus] = useState("initial");

  const fetchVideos = async (search = "") => {
    setApiStatus("loading");

    const jwtToken = Cookies.get("jwt_token");
    const url = `https://apis.ccbp.in/videos/all?search=${search}`;
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
          publishedAt: eachVideo.published_at,
          name: eachVideo.channel.name,
          profileImageUrl: eachVideo.channel.profile_image_url,
        }));

        setVideos(updatedData);
        setApiStatus("success");
      } else {
        setApiStatus("failure");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setApiStatus("failure");
    }
  };

  useEffect(() => {
    fetchVideos(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleRetry = () => {
    fetchVideos(searchQuery);
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

  const formatPublishedDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const renderLoadingView = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        <p className="text-gray-600">Loading videos...</p>
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

  const renderNoVideosView = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="bg-gray-100 p-4 rounded-full">
          <Search className="w-12 h-12 text-gray-600" />
        </div>
        <h2 className="text-gray-900">No Search Results Found</h2>
        <p className="text-gray-600">
          Try different key words or remove search filter
        </p>
        <button
          onClick={() => {
            setSearchInput("");
            setSearchQuery("");
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Clear Search
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

          <div className="p-3 flex gap-3">
            <div className="shrink-0">
              <img
                src={video.profileImageUrl}
                alt={video.name}
                className="w-9 h-9 rounded-full"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
                {video.title}
              </h3>
              <p className="text-gray-600 text-sm mb-1">{video.name}</p>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span>{formatViews(video.viewCount)} views</span>
                <span>•</span>
                <span>{formatPublishedDate(video.publishedAt)}</span>
              </div>
            </div>
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
        return videos.length === 0 ? renderNoVideosView() : renderVideosView();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>
      </div>

      {renderContent()}
    </div>
  );
};

export default Hero;
