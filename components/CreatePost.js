import { useState, useContext } from 'react';
import { AuthContext } from '../pages/_app';
import { Send } from 'lucide-react';

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (response.ok) {
        const newPost = await response.json();
        setContent('');
        if (onPostCreated) {
          onPostCreated(newPost);
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Share something with your network
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="input-field resize-none"
            rows="4"
            maxLength="1000"
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {content.length}/1000 characters
            </span>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send size={16} className="mr-2" />
              )}
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 