const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['client', 'invoice', 'meeting', 'task'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'scheduled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: true
  },
  completedDate: {
    type: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedTo: {
    type: String,
    trim: true
  },
  notificationChannels: [{
    type: String,
    enum: ['email', 'sms', 'slack', 'teams', 'whatsapp'],
    default: ['email']
  }],
  reminderSchedule: {
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'custom'],
      default: 'once'
    },
    customInterval: {
      type: Number // in minutes
    },
    nextReminder: {
      type: Date
    }
  },
  notes: [{
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  history: [{
    action: {
      type: String,
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient querying
followUpSchema.index({ status: 1, dueDate: 1 });
followUpSchema.index({ assignedTo: 1, status: 1 });
followUpSchema.index({ type: 1, status: 1 });

// Middleware to update history on status change
followUpSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.history.push({
      action: `Status changed to ${this.status}`,
      performedBy: this.assignedTo // You might want to pass the actual user who made the change
    });
  }
  next();
});

const FollowUp = mongoose.model('FollowUp', followUpSchema);

module.exports = FollowUp; 