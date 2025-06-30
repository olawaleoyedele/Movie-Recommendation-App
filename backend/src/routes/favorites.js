import express from 'express';
import jwt from 'jsonwebtoken';
import Favorite from '../models/Favorite.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Save favorite
router.post('/', verifyToken, async (req, res) => {
  try {
    const { movieId, title, poster, release_date } = req.body;
    const fav = new Favorite({
      userId: req.userId,
      movieId,
      title,
      poster,
      release_date
    });
    await fav.save();
    res.status(201).json({ message: 'Favorite saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all favorites for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a favorite
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const fav = await Favorite.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!fav) return res.status(404).json({ error: 'Favorite not found' });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
// Get favorites for user