import Link from 'next/link';
import { MessageCircle, Clock } from 'lucide-react';

export default function PostCard({ post }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="card">
      <div className="flex items-start space-x-3">
        {/* Author Avatar */}
        <div className="w-10 h-10 bg-linkedin-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold">
            {post.author.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Link 
              href={`/profile/${post.author._id}`}
              className="font-semibold text-gray-900 hover:text-linkedin-600 transition-colors"
            >
              {post.author.name}
            </Link>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={14} className="mr-1" />
              {formatDate(post.createdAt)}
            </div>
          </div>
          
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>
          
          <div className="flex items-center text-gray-500">
            <MessageCircle size={16} className="mr-1" />
            <span className="text-sm">Post</span>
          </div>
        </div>
      </div>
    </div>
  );
} 