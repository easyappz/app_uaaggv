const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const mongoDb = mongoose.createConnection(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoDb
  .asPromise()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  city: { type: String, required: true },
  points: { type: Number, default: 0 },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null }
});

// Photo Schema
const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  isEvaluated: { type: Boolean, default: false }
});

// Rating Schema
const ratingSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 1, max: 10 },
  ratedAt: { type: Date, default: Date.now }
});

// Models
const User = mongoDb.model('User', userSchema);
const Photo = mongoDb.model('Photo', photoSchema);
const Rating = mongoDb.model('Rating', ratingSchema);

module.exports = {
  mongoDb,
  User,
  Photo,
  Rating
};
