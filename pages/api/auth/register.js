import clientPromise from '../../../lib/mongodb';
import { hashPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashedPassword,
      bio: '',
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Return user data without password
    const user = {
      _id: result.insertedId,
      name: newUser.name,
      email: newUser.email,
      bio: newUser.bio,
      createdAt: newUser.createdAt,
    };

    res.status(201).json({ 
      message: 'User created successfully',
      user 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 