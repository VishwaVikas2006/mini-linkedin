# Mini LinkedIn - Community Platform

A modern, LinkedIn-inspired community platform built with Next.js, React, and MongoDB Atlas. Users can create profiles, share posts, and connect with other professionals.

## 🚀 Features

### User Authentication
- **Secure Registration & Login**: Email and password authentication with bcrypt password hashing
- **JWT Token Management**: Secure session management with JSON Web Tokens
- **User Profiles**: Name, email, bio, and join date information
- **Form Validation**: Client and server-side validation with error handling

### Public Post Feed
- **Create Posts**: Authenticated users can create text-only posts (up to 1000 characters)
- **Real-time Feed**: All posts displayed in chronological order (newest first)
- **Public Access**: Posts are readable without login requirement
- **Author Information**: Each post shows author name and timestamp

### User Profile Pages
- **Dynamic Profiles**: Access user profiles at `/profile/[userId]`
- **Profile Information**: Display name, email, bio, and join date
- **User Posts**: Show all posts by the specific user
- **Bio Editing**: Authenticated users can edit their own bio
- **Responsive Design**: Clean, professional layout

### Modern UI/UX
- **Tailwind CSS**: Beautiful, responsive design with custom components
- **Professional Styling**: LinkedIn-inspired color scheme and layout
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: Modern React with hooks and context
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB Atlas**: Cloud database service
- **bcryptjs**: Password hashing and verification
- **jsonwebtoken**: JWT token generation and verification

### Development
- **TypeScript**: Type-safe development
- **ESLint**: Code linting and formatting
- **Environment Variables**: Secure configuration management

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js 18+** installed on your machine
- **MongoDB Atlas** account (free tier available)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mini-linkedin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Update the `.env.local` file with your configuration:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/mini-linkedin?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
```

### 4. Set Up MongoDB Atlas

1. **Create a MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (M0 Free tier recommended)

2. **Configure Database**:
   - Create a database named `mini-linkedin`
   - Create collections: `users` and `posts`
   - Set up network access (allow all IPs for development: `0.0.0.0/0`)
   - Create a database user with read/write permissions

3. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and replace `<password>` with your database user password

### 5. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This will create 4 sample users with posts. Use these credentials to test:

- **Email**: john@example.com | **Password**: password123
- **Email**: jane@example.com | **Password**: password123
- **Email**: mike@example.com | **Password**: password123
- **Email**: sarah@example.com | **Password**: password123

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
mini-linkedin/
├── components/           # React components
│   ├── NavBar.js        # Navigation component
│   ├── PostCard.js      # Individual post display
│   └── CreatePost.js    # Post creation form
├── lib/                 # Utility libraries
│   ├── mongodb.js       # Database connection
│   └── auth.js          # Authentication utilities
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── posts/       # Posts endpoints
│   │   └── users/       # User endpoints
│   ├── profile/         # Profile pages
│   ├── _app.js          # App wrapper
│   ├── index.js         # Home page
│   ├── login.js         # Login page
│   └── register.js      # Registration page
├── scripts/             # Utility scripts
│   └── seed.js          # Database seeding
├── styles/              # Global styles
│   └── globals.css      # Tailwind CSS imports
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
└── README.md           # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get all posts (public)
- `POST /api/posts` - Create new post (authenticated)

### Users
- `GET /api/users/[id]` - Get user profile and posts (public)
- `PUT /api/users/[id]` - Update user bio (authenticated, owner only)

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom components. You can customize:

- **Colors**: Update `tailwind.config.js` for brand colors
- **Components**: Modify component classes in `styles/globals.css`
- **Layout**: Adjust container widths and spacing

### Features
- **Post Length**: Change character limit in `pages/api/posts/index.js`
- **Bio Length**: Modify bio character limit in `pages/api/users/[id].js`
- **Token Expiry**: Update JWT expiration in `lib/auth.js`

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Environment Variables in Vercel**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NEXTAUTH_URL`: Your production URL
   - `NEXTAUTH_SECRET`: Your NextAuth secret

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:

- **Netlify**: Use Netlify Functions for API routes
- **Railway**: Full-stack deployment with database
- **Heroku**: Traditional hosting with MongoDB Atlas

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for production
- **Environment Variables**: Secure configuration management

## 🧪 Testing

### Manual Testing
1. **Registration**: Create new accounts
2. **Login**: Test authentication flow
3. **Posts**: Create and view posts
4. **Profiles**: View and edit user profiles
5. **Navigation**: Test all navigation links

### Sample Data
Use the seeded data for testing:
- Login with sample credentials
- View different user profiles
- Test post creation and viewing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your MongoDB connection string
3. Ensure all environment variables are set
4. Check the browser's network tab for API errors

## 🎯 Future Enhancements

- **Real-time Updates**: WebSocket integration for live posts
- **Image Upload**: Support for profile pictures and post images
- **Comments System**: Allow users to comment on posts
- **Like/Reactions**: Add engagement features
- **Search Functionality**: Search users and posts
- **Notifications**: Real-time notifications for interactions
- **Mobile App**: React Native version
- **Advanced Analytics**: User engagement metrics

---

**Built with ❤️ using Next.js, React, and MongoDB Atlas** 