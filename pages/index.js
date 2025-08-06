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
      const response = await fetch('/api/posts');
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError('Failed to load posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
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
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-linkedin-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchPosts}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Mini LinkedIn
        </h1>
        <p className="text-gray-600">
          Connect with professionals and share your thoughts with the community.
        </p>
      </div>

      {/* Create Post Form (only for authenticated users) */}
      {user && <CreatePost onPostCreated={handlePostCreated} />}

      {/* Posts Feed */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Recent Posts
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No posts yet.</p>
            {user ? (
              <p className="text-gray-600">Be the first to share something!</p>
            ) : (
              <p className="text-gray-600">
                <Link href="/login" className="text-linkedin-600 hover:underline">
                  Login
                </Link> to start posting.
              </p>
            )}
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 