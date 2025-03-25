const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_follow_ups',
      'view_reports',
      'manage_settings'
    ]
  }],
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Set default permissions based on role
userSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    switch (this.role) {
      case 'admin':
        this.permissions = [
          'manage_users',
          'manage_follow_ups',
          'view_reports',
          'manage_settings'
        ];
        break;
      case 'manager':
        this.permissions = [
          'manage_follow_ups',
          'view_reports'
        ];
        break;
      case 'user':
        this.permissions = [
          'manage_follow_ups'
        ];
        break;
    }
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User; 