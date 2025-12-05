import mongoose from 'mongoose';

const testAssignmentSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true
  },
  testerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tester',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'completed', 'overdue'],
    default: 'assigned'
  },
  testResult: {
    type: String,
    enum: ['pass', 'fail', 'pending'],
    default: 'pending'
  },
  comments: {
    type: String,
    default: ''
  },
  screenshots: [{
    type: String // URLs to uploaded screenshots
  }],
  testCycle: {
    type: Number,
    default: 1 // Which bi-weekly cycle this belongs to
  }
}, {
  timestamps: true
});

export default mongoose.models.TestAssignment || mongoose.model('TestAssignment', testAssignmentSchema);