import React from "react";
import { Bookmark, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const SavedVideos = ({ savedVideos }) => {
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
    } catch {
      return dateString;
    }
  };

  // Empty view
  if (savedVideos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="bg-red-50 p-4 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-gray-900">No Saved Videos</h2>
          <p className="text-gray-600">Videos you save will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-3 rounded-full">
            <Bookmark className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-gray-900">Saved Videos</h1>
        </div>
      </div>

      {/* Saved Videos List */}
      <div className="space-y-4">
        {savedVideos.map((video) => (
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
    </div>
  );
};

export default SavedVideos;
