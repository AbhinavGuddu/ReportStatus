import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'co-admin', 'tester'],
    required: true
  },
  pin: {
    type: String,
    required: function() {
      return this.role === 'admin' || this.role === 'co-admin';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);