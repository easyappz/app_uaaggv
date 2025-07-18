const express = require('express');
const { User, Photo, Rating } = require('./db');

const router = express.Router();

// Helper function to hash passwords (using a simple placeholder for now)
const hashPassword = (password) => {
  // In a real app, use bcrypt or another secure hashing library
  return `hashed_${password}`;
};

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, gender, age, city } = req.body;
    if (!email || !password || !name || !gender || !age || !city) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({
      email,
      password: hashPassword(password),
      name,
      gender,
      age,
      city,
      points: 0
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Password Reset Request
router.post('/reset-password-request', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a simple token (in a real app, use a secure random token)
    const token = `reset_${Date.now()}`;
    const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    res.json({ message: 'Password reset token generated', token });
  } catch (error) {
    console.error('Reset password request error:', error);
    res.status(500).json({ error: 'Reset password request failed' });
  }
});

// Password Reset
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    const user = await User.findOne({ resetToken: token });
    if (!user || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = hashPassword(newPassword);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Reset password failed' });
  }
});

// Upload Photo
router.post('/upload-photo', async (req, res) => {
  try {
    const { userId, photoUrl } = req.body;
    if (!userId || !photoUrl) {
      return res.status(400).json({ error: 'User ID and photo URL are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.points < 1) {
      return res.status(403).json({ error: 'Not enough points to upload photo for evaluation' });
    }

    // Deduct 1 point for uploading a photo
    user.points -= 1;
    await user.save();

    const photo = new Photo({
      userId,
      url: photoUrl,
      uploadedAt: new Date()
    });

    await photo.save();
    res.status(201).json({ message: 'Photo uploaded successfully', photoId: photo._id, points: user.points });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ error: 'Photo upload failed' });
  }
});

// Get Photo for Evaluation
router.get('/get-photo/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find a photo that hasn't been evaluated by this user
    const ratedPhotoIds = await Rating.find({ userId }).distinct('photoId');
    const photo = await Photo.findOne({ 
      userId: { $ne: userId },
      _id: { $nin: ratedPhotoIds },
      isEvaluated: false 
    });

    if (!photo) {
      return res.status(404).json({ error: 'No photos available for evaluation' });
    }

    res.json({ photoId: photo._id, url: photo.url });
  } catch (error) {
    console.error('Get photo error:', error);
    res.status(500).json({ error: 'Failed to get photo' });
  }
});

// Submit Rating
router.post('/submit-rating', async (req, res) => {
  try {
    const { userId, photoId, score } = req.body;
    if (!userId || !photoId || !score) {
      return res.status(400).json({ error: 'User ID, photo ID, and score are required' });
    }

    if (score < 1 || score > 10) {
      return res.status(400).json({ error: 'Score must be between 1 and 10' });
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has already rated this photo
    const existingRating = await Rating.findOne({ userId, photoId });
    if (existingRating) {
      return res.status(403).json({ error: 'You have already rated this photo' });
    }

    const rating = new Rating({
      photoId,
      userId,
      score,
      ratedAt: new Date()
    });

    await rating.save();

    // Increment user points by 1 for rating a photo
    user.points += 1;
    await user.save();

    // Check if the photo has received enough ratings to be marked as evaluated
    const ratingCount = await Rating.countDocuments({ photoId });
    if (ratingCount >= 5) { // Arbitrary threshold for marking as evaluated
      photo.isEvaluated = true;
      await photo.save();
    }

    res.status(201).json({ message: 'Rating submitted successfully', points: user.points });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Rating submission failed' });
  }
});

// Get Analytics for a Photo
router.get('/analytics/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    if (!photoId) {
      return res.status(400).json({ error: 'Photo ID is required' });
    }

    const ratings = await Rating.find({ photoId }).populate('userId');
    if (!ratings.length) {
      return res.status(404).json({ error: 'No ratings found for this photo' });
    }

    const analytics = ratings.map(rating => ({
      score: rating.score,
      ratedAt: rating.ratedAt,
      rater: {
        gender: rating.userId.gender,
        age: rating.userId.age,
        city: rating.userId.city
      }
    }));

    res.json({ analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Get User Points
router.get('/points/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ points: user.points });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({ error: 'Failed to get user points' });
  }
});

module.exports = router;
