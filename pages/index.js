import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from './_app';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/posts');
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Posts API error:', errorData);
        setError(errorData.error || 'Failed to load posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Network error: Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-linkedin-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchPosts}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Mini LinkedIn
        </h1>
        <p className="text-gray-600">
          Connect with professionals and share your thoughts with the community.
        </p>
      </div>

      {/* Create Post Form (only for authenticated users) */}
      {user && (
        <div className="mb-8">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* Posts Feed */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Posts
          </h2>
          {user && (
            <Link 
              href={`/profile/${user._id}`}
              className="text-linkedin-600 hover:text-linkedin-700 text-sm font-medium"
            >
              View My Profile →
            </Link>
          )}
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No posts yet.</p>
            {user ? (
              <p className="text-gray-600">Be the first to share something!</p>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Join the community to start posting and connecting with professionals.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link href="/login" className="btn-primary">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-secondary">
                    Join Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 