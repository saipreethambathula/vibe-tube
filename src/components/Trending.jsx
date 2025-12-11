import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Loader2, AlertCircle, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [apiStatus, setApiStatus] = useState("initial");

  const fetchTrendingVideos = async () => {
    setApiStatus("loading");

    const jwtToken = Cookies.get("jwt_token");
    const url = `https://apis.ccbp.in/videos/trending`;
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
      console.error("Error fetching trending videos:", error);
      setApiStatus("failure");
    }
  };

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  const handleRetry = () => {
    fetchTrendingVideos();
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
        <p className="text-gray-600">Loading trending videos...</p>
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
    <div className="space-y-4">
      {videos.map((video) => (
        <Link
          to={`/videos/${video.id}`}
          key={video.id}
          className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group flex flex-col sm:flex-row gap-4 p-4"
        >
          <div className="sm:w-80 sm:shrink-0">
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
              {video.title}
            </h3>

            <div className="flex items-center gap-3 mb-2">
              <img
                src={video.profileImageUrl}
                alt={video.name}
                className="w-8 h-8 rounded-full hidden sm:block"
              />
              <p className="text-gray-600">{video.name}</p>
            </div>

            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <span>{formatViews(video.viewCount)} views</span>
              <span>•</span>
              <span>{formatPublishedDate(video.publishedAt)}</span>
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
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-gray-900">Trending</h1>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default Trending;
