const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const measurementSchema = new mongoose.Schema({
  arms: { type: String, default: '' },
  chest: { type: String, default: '' },
  waist: { type: String, default: '' },
  hips: { type: String, default: '' },
  thighs: { type: String, default: '' }
});

const measurementHistorySchema = new mongoose.Schema({
  measurements: measurementSchema,
  weight: { type: String, default: '' },
  weightUnit: { type: String, default: 'kg', enum: ['kg', 'lb'] },
  measurementUnit: { type: String, default: 'cm', enum: ['cm', 'in'] },
  timestamp: { type: Date, default: Date.now }
});

const workoutSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['A', 'B', 'C'] },
  timestamp: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  recoveryNotes: {
    type: String,
    default: ''
  },
  reminders: {
    type: Boolean,
    default: false
  },
  trainingPhase: {
    type: String,
    default: 'Phase 1'
  },
  weight: {
    type: String,
    default: ''
  },
  weightUnit: {
    type: String,
    default: 'kg'
  },
  height: {
    type: String,
    default: ''
  },
  heightUnit: {
    type: String,
    default: 'cm'
  },
  measurements: {
    arms: { type: String, default: '' },
    chest: { type: String, default: '' },
    waist: { type: String, default: '' },
    hips: { type: String, default: '' },
    thighs: { type: String, default: '' }
  },
  measurementUnit: {
    type: String,
    default: 'cm'
  },
  isOnboardingComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  measurementsHistory: [measurementHistorySchema],
  workouts: [workoutSchema],
}, { timestamps: true });

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 