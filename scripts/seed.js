const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('posts').deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: await bcrypt.hash('password123', 12),
        bio: 'Software Engineer passionate about building scalable applications. Love working with React, Node.js, and MongoDB.',
        createdAt: new Date('2024-01-15'),
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: await bcrypt.hash('password123', 12),
        bio: 'Product Manager with 5+ years of experience in tech startups. Focused on user-centered design and data-driven decisions.',
        createdAt: new Date('2024-01-20'),
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        passwordHash: await bcrypt.hash('password123', 12),
        bio: 'Full-stack developer specializing in modern web technologies. Always eager to learn new frameworks and tools.',
        createdAt: new Date('2024-02-01'),
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        passwordHash: await bcrypt.hash('password123', 12),
        bio: 'UX/UI Designer creating beautiful and functional user experiences. Passionate about accessibility and inclusive design.',
        createdAt: new Date('2024-02-10'),
      },
    ];

    const usersResult = await db.collection('users').insertMany(users);
    console.log(`Created ${users.length} users`);

    // Get user IDs for posts
    const userIds = Object.values(usersResult.insertedIds);

    // Create sample posts
    const posts = [
      {
        authorId: userIds[0], // John Doe
        content: 'Just finished implementing a new feature using React hooks and Context API. The code is much cleaner now! 🚀 #React #WebDevelopment',
        createdAt: new Date('2024-03-01T10:30:00Z'),
      },
      {
        authorId: userIds[1], // Jane Smith
        content: 'Excited to share that our team just launched a new product feature that increased user engagement by 25%! 📈 #ProductManagement #Analytics',
        createdAt: new Date('2024-03-02T14:15:00Z'),
      },
      {
        authorId: userIds[2], // Mike Johnson
        content: 'Learning TypeScript has been a game-changer for our codebase. The type safety and better IDE support are incredible! 💻 #TypeScript #Programming',
        createdAt: new Date('2024-03-03T09:45:00Z'),
      },
      {
        authorId: userIds[3], // Sarah Wilson
        content: 'Design tip: Always consider accessibility first. Your users will thank you, and it often leads to better overall design decisions. ♿ #UX #Accessibility',
        createdAt: new Date('2024-03-04T16:20:00Z'),
      },
      {
        authorId: userIds[0], // John Doe
        content: 'Attended an amazing tech conference today! Met so many inspiring developers and learned about the latest trends in web development. #TechConference #Networking',
        createdAt: new Date('2024-03-05T18:30:00Z'),
      },
      {
        authorId: userIds[1], // Jane Smith
        content: 'Working on a new project that involves machine learning integration. The possibilities are endless! 🤖 #MachineLearning #Innovation',
        createdAt: new Date('2024-03-06T11:00:00Z'),
      },
      {
        authorId: userIds[2], // Mike Johnson
        content: 'Just deployed our first microservice to production. The journey from monolith to microservices has been challenging but rewarding! 🏗️ #Microservices #DevOps',
        createdAt: new Date('2024-03-07T13:45:00Z'),
      },
      {
        authorId: userIds[3], // Sarah Wilson
        content: 'User research is the foundation of great design. Spent the day interviewing users and the insights were invaluable! 📊 #UserResearch #Design',
        createdAt: new Date('2024-03-08T15:30:00Z'),
      },
    ];

    await db.collection('posts').insertMany(posts);
    console.log(`Created ${posts.length} posts`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Sample User Credentials:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');
    console.log('Email: mike@example.com | Password: password123');
    console.log('Email: sarah@example.com | Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

seedDatabase(); 