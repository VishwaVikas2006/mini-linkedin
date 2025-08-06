import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../_app';
import PostCard from '../../components/PostCard';
import { Loader2, Edit3, Save, X, Mail, Calendar } from 'lucide-react';

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [isUpdatingBio, setIsUpdatingBio] = useState(false);
  
  const { user: currentUser, token } = useContext(AuthContext);
  const router = useRouter();
  const { userId } = router.query;

  const isOwnProfile = currentUser && currentUser._id === userId;

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setPosts(data.posts);
        setBioText(data.user.bio || '');
      } else if (response.status === 404) {
        setError('User not found');
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, fetchUserProfile]);

  const handleUpdateBio = async () => {
    if (!token) return;

    setIsUpdatingBio(true);
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: bioText }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setIsEditingBio(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update bio');
      }
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Failed to update bio');
    } finally {
      setIsUpdatingBio(false);
    }
  };

  const cancelEdit = () => {
    setBioText(profile.bio || '');
    setIsEditingBio(false);
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
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">User not found</p>
        <button 
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          Go Home
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="flex items-start space-x-6">
          {/* Profile Avatar */}
          <div className="w-24 h-24 bg-linkedin-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-3xl">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              {isOwnProfile && (
                <div className="flex space-x-2">
                  {isEditingBio ? (
                    <>
                      <button
                        onClick={handleUpdateBio}
                        disabled={isUpdatingBio}
                        className="btn-primary flex items-center"
                      >
                        {isUpdatingBio ? (
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                          <Save size={16} className="mr-2" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn-secondary flex items-center"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="btn-secondary flex items-center"
                    >
                      <Edit3 size={16} className="mr-2" />
                      Edit Bio
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>{profile.email}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span>Joined {formatDate(profile.createdAt)}</span>
              </div>

              {/* Bio Section */}
              <div className="mt-4">
                {isEditingBio ? (
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      className="input-field resize-none"
                      rows="3"
                      maxLength="500"
                      placeholder="Tell us about yourself..."
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {bioText.length}/500 characters
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {profile.bio || (isOwnProfile ? 'Add a bio to tell others about yourself...' : 'No bio available')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Posts by {profile.name}
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No posts yet.</p>
            {isOwnProfile ? (
              <p className="text-gray-600">
                <button 
                  onClick={() => router.push('/')}
                  className="text-linkedin-600 hover:underline"
                >
                  Create your first post
                </button>
              </p>
            ) : (
              <p className="text-gray-600">This user hasn&apos;t posted anything yet.</p>
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