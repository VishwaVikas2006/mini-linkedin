import clientPromise from '../../../lib/mongodb';
import { requireAuth } from '../../../lib/auth';
import { ObjectId } from 'mongodb';

async function getPosts(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const postsCollection = db.collection('posts');
    const usersCollection = db.collection('users');

    // Get all posts with author information
    const posts = await postsCollection
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author'
          }
        },
        {
          $unwind: '$author'
        },
        {
          $project: {
            _id: 1,
            content: 1,
            createdAt: 1,
            'author._id': 1,
            'author.name': 1,
            'author.email': 1
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray();

    res.status(200).json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createPost(req, res) {
  try {
    const { content } = req.body;
    const userId = req.userId; // Set by requireAuth middleware

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'Post content must be less than 1000 characters' });
    }

    const client = await clientPromise;
    const db = client.db();
    const postsCollection = db.collection('posts');

    // Convert userId to ObjectId
    let authorId;
    try {
      authorId = new ObjectId(userId);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Create new post
    const newPost = {
      authorId: authorId,
      content: content.trim(),
      createdAt: new Date(),
    };

    const result = await postsCollection.insertOne(newPost);

    // Get the created post with author information
    const createdPost = await postsCollection
      .aggregate([
        {
          $match: { _id: result.insertedId }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author'
          }
        },
        {
          $unwind: '$author'
        },
        {
          $project: {
            _id: 1,
            content: 1,
            createdAt: 1,
            'author._id': 1,
            'author.name': 1,
            'author.email': 1
          }
        }
      ])
      .toArray();

    res.status(201).json(createdPost[0]);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getPosts(req, res);
    case 'POST':
      return requireAuth(createPost)(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
} 