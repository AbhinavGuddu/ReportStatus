import mongoose from 'mongoose';

const testerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  expertise: [{
    type: String, // Category names they specialize in
    required: false
  }],
  capacity: {
    type: Number,
    default: 5 // Max concurrent tests
  },
  isActive: {
    type: Boolean,
    default: true
  },
  environment: {
    type: String,
    enum: ['aws', 'dc', 'both'],
    default: 'both'
  }
}, {
  timestamps: true
});

export default mongoose.models.Tester || mongoose.model('Tester', testerSchema);