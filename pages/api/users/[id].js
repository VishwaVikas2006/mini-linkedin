import clientPromise from '../../../lib/mongodb';
import { requireAuth } from '../../../lib/auth';
import { ObjectId } from 'mongodb';

async function getUserProfile(req, res) {
  try {
    const { id } = req.query;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const postsCollection = db.collection('posts');

    // Get user profile
    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { passwordHash: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's posts
    const posts = await postsCollection
      .aggregate([
        {
          $match: { authorId: new ObjectId(id) }
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
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray();

    res.status(200).json({
      user,
      posts
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateUserBio(req, res) {
  try {
    const { id } = req.query;
    const { bio } = req.body;
    const userId = req.userId; // Set by requireAuth middleware

    // Check if user is updating their own profile
    if (userId !== id) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Validation
    if (bio && bio.length > 500) {
      return res.status(400).json({ error: 'Bio must be less than 500 characters' });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Update user bio
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { bio: bio ? bio.trim() : '' } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get updated user
    const updatedUser = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { passwordHash: 0 } }
    );

    res.status(200).json({
      message: 'Bio updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user bio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getUserProfile(req, res);
    case 'PUT':
      return requireAuth(updateUserBio)(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
} 