import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";

export default function Video({ onSave }) {
  const { id } = useParams();

  const [savedToggle, setsavedToggle] = useState(false);

  const [video, setVideo] = useState(null);
  const [apiStatus, setApiStatus] = useState("loading");

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const formatData = (data) => ({
    id: data.video_details.id,
    title: data.video_details.title,
    videoUrl: data.video_details.video_url,
    thumbnailUrl: data.video_details.thumbnail_url,
    viewCount: data.video_details.view_count,
    publishedAt: data.video_details.published_at,
    description: data.video_details.description,
    name: data.video_details.channel.name,
    profileImageUrl: data.video_details.channel.profile_image_url,
    subscriberCount: data.video_details.channel.subscriber_count,
  });

  const fetchVideo = async () => {
    setApiStatus("loading");

    const jwtToken = Cookies.get("jwt_token");
    const response = await fetch(`https://apis.ccbp.in/videos/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${jwtToken}` },
    });

    if (response.ok) {
      const data = await response.json();
      setVideo(formatData(data));
      setApiStatus("success");
    } else {
      setApiStatus("error");
    }
  };

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
    setIsDisliked(false);
  };

  const toggleDislike = () => {
    setIsDisliked((prev) => !prev);
    setIsLiked(false);
  };

  const toggleSave = () => {
    setsavedToggle((prev) => !prev);
  };

  if (apiStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Loading...</p>
      </div>
    );
  }

  if (apiStatus === "error") {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <h2>Something went wrong</h2>
        <button
          onClick={fetchVideo}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!video) return null;

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const match = url.match(/v=([^&]+)/);
    const vid = match ? match[1] : "";
    return `https://www.youtube.com/embed/${vid}`;
  };

  const embedUrl = getEmbedUrl(video.videoUrl);

  return (
    <div className="p-6 space-y-4">
      {/* iframe player */}
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={video.title}
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>

      {/* Title */}
      <h1 className="text-xl font-semibold text-black">{video.title}</h1>

      {/* Views + Date + Buttons */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {video.viewCount} views • {video.publishedAt}
        </p>

        <div className="flex gap-4 items-center">
          {/* LIKE */}
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border-0 cursor-pointer ${
              isLiked
                ? "border-red-600 text-red-600"
                : "border-gray-400 text-gray-600"
            }`}
          >
            <ThumbsUp size={20} />
            Like
          </button>

          {/* DISLIKE */}
          <button
            onClick={toggleDislike}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border-0 cursor-pointer ${
              isDisliked
                ? "border-red-600 text-red-600"
                : "border-gray-400 text-gray-600"
            }`}
          >
            <ThumbsDown size={20} />
            Dislike
          </button>

          {/* SAVE */}
          <button
            onClick={() => {
              onSave(video);
              toggleSave();
            }}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border-0 cursor-pointer ${
              savedToggle
                ? "border-red-600 text-red-600"
                : "border-gray-400 text-gray-600"
            }`}
          >
            <Bookmark size={20} />
            Save
          </button>
        </div>
      </div>

      <hr />

      {/* Channel Info */}
      <div className="flex gap-4 mt-4">
        <img
          src={video.profileImageUrl}
          alt="channel"
          className="w-12 h-12 rounded-full"
        />

        <div>
          <p className="font-medium">{video.name}</p>
          <p className="text-gray-600">{video.subscriberCount} Subscribers</p>
          <p className="text-gray-700 mt-2">{video.description}</p>
        </div>
      </div>
    </div>
  );
}
