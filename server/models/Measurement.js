const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  measurements: {
    arms: { type: String, default: '' },
    chest: { type: String, default: '' },
    waist: { type: String, default: '' },
    hips: { type: String, default: '' },
    thighs: { type: String, default: '' }
  },
  weight: {
    type: String,
    default: ''
  },
  weightUnit: {
    type: String,
    default: 'kg'
  },
  measurementUnit: {
    type: String,
    default: 'cm'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Measurement', MeasurementSchema); 