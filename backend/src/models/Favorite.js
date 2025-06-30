import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: Number,
  title: String,
  poster: String,
  release_date: String
}, { timestamps: true });

export default mongoose.model('Favorite', favoriteSchema);
// This schema defines the structure for favorite movies in the database.
// It includes fields for user ID, movie ID, title, poster image URL, and release