import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthContext } from '../pages/_app';
import { Home, User, LogOut, LogIn, UserPlus, Briefcase, MessageCircle, Bell } from 'lucide-react';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleJobsClick = () => {
    alert('Jobs feature coming soon! 🚀\n\nThis would show available job opportunities and allow you to apply for positions.');
  };

  const handleMessagingClick = () => {
    alert('Messaging feature coming soon! 💬\n\nThis would allow you to send and receive messages with other professionals.');
  };

  const handleNotificationsClick = () => {
    alert('Notifications feature coming soon! 🔔\n\nThis would show you updates about your posts, connections, and other activities.');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linkedin-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Mini LinkedIn</span>
            </Link>
          </div>

          {/* Navigation Links - Only show when logged in */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  router.pathname === '/' 
                    ? 'text-linkedin-600 bg-linkedin-50' 
                    : 'text-gray-700 hover:text-linkedin-600 hover:bg-gray-50'
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              
              <Link 
                href={`/profile/${user._id}`}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  router.pathname.startsWith('/profile') 
                    ? 'text-linkedin-600 bg-linkedin-50' 
                    : 'text-gray-700 hover:text-linkedin-600 hover:bg-gray-50'
                }`}
              >
                <User size={18} />
                <span>Profile</span>
              </Link>

              <button 
                onClick={handleJobsClick}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-linkedin-600 hover:bg-gray-50 transition-colors"
              >
                <Briefcase size={18} />
                <span>Jobs</span>
              </button>

              <button 
                onClick={handleMessagingClick}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-linkedin-600 hover:bg-gray-50 transition-colors"
              >
                <MessageCircle size={18} />
                <span>Messaging</span>
              </button>

              <button 
                onClick={handleNotificationsClick}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-linkedin-600 hover:bg-gray-50 transition-colors"
              >
                <Bell size={18} />
                <span>Notifications</span>
              </button>
            </div>
          )}

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Avatar and Name */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-linkedin-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-linkedin-600 hover:bg-gray-50 transition-colors"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
                
                <Link 
                  href="/register"
                  className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-linkedin-600 hover:bg-linkedin-700 transition-colors"
                >
                  <UserPlus size={16} />
                  <span>Join</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/' 
                  ? 'text-linkedin-600 bg-linkedin-50' 
                  : 'text-gray-700 hover:text-linkedin-600 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link 
              href={`/profile/${user._id}`}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname.startsWith('/profile') 
                  ? 'text-linkedin-600 bg-linkedin-50' 
                  : 'text-gray-700 hover:text-linkedin-600 hover:bg-gray-50'
              }`}
            >
              Profile
            </Link>
            <button 
              onClick={handleJobsClick}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-linkedin-600 hover:bg-gray-50"
            >
              Jobs
            </button>
            <button 
              onClick={handleMessagingClick}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-linkedin-600 hover:bg-gray-50"
            >
              Messaging
            </button>
            <button 
              onClick={handleNotificationsClick}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-linkedin-600 hover:bg-gray-50"
            >
              Notifications
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 