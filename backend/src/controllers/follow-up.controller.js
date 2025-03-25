const FollowUp = require('../models/follow-up.model');

// Create new follow-up
exports.createFollowUp = async (req, res) => {
  try {
    const followUpData = {
      ...req.body,
      assignedBy: req.user._id
    };

    const followUp = new FollowUp(followUpData);
    await followUp.save();

    // Populate user details
    await followUp.populate('assignedTo assignedBy', 'name email');

    res.status(201).json({
      message: 'Follow-up created successfully',
      followUp
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating follow-up', error: error.message });
  }
};

// Get all follow-ups with filters
exports.getFollowUps = async (req, res) => {
  try {
    const {
      type,
      status,
      priority,
      assignedTo,
      startDate,
      endDate,
      search
    } = req.query;

    // Build query
    const query = {};

    // Add filters if provided
    if (type) query.type = type;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    // Date range filter
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // If not admin, only show follow-ups assigned to user
    if (req.user.role !== 'admin') {
      query.assignedTo = req.user._id;
    }

    const followUps = await FollowUp.find(query)
      .populate('assignedTo assignedBy', 'name email')
      .sort({ dueDate: 1 });

    res.json(followUps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching follow-ups', error: error.message });
  }
};

// Get follow-up by ID
exports.getFollowUpById = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id)
      .populate('assignedTo assignedBy', 'name email')
      .populate('notes.createdBy', 'name email')
      .populate('history.performedBy', 'name email');

    if (!followUp) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }

    // Check if user has access
    if (req.user.role !== 'admin' && 
        followUp.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    res.json(followUp);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching follow-up', error: error.message });
  }
};

// Update follow-up
exports.updateFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    if (!followUp) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }

    // Check if user has access
    if (req.user.role !== 'admin' && 
        followUp.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Update fields
    const updates = req.body;
    Object.assign(followUp, updates);

    // Add to history
    followUp.history.push({
      action: 'Updated follow-up details',
      performedBy: req.user._id
    });

    await followUp.save();
    await followUp.populate('assignedTo assignedBy', 'name email');

    res.json({
      message: 'Follow-up updated successfully',
      followUp
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating follow-up', error: error.message });
  }
};

// Delete follow-up
exports.deleteFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    if (!followUp) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }

    // Check if user has access
    if (req.user.role !== 'admin' && 
        followUp.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    await followUp.remove();
    res.json({ message: 'Follow-up deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting follow-up', error: error.message });
  }
};

// Add note to follow-up
exports.addNote = async (req, res) => {
  try {
    const { content } = req.body;
    const followUp = await FollowUp.findById(req.params.id);

    if (!followUp) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }

    // Check if user has access
    if (req.user.role !== 'admin' && 
        followUp.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    followUp.notes.push({
      content,
      createdBy: req.user._id
    });

    await followUp.save();
    await followUp.populate('notes.createdBy', 'name email');

    res.json({
      message: 'Note added successfully',
      notes: followUp.notes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding note', error: error.message });
  }
};

// Complete follow-up
exports.completeFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    if (!followUp) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }

    // Check if user has access
    if (req.user.role !== 'admin' && 
        followUp.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    followUp.status = 'completed';
    followUp.completedDate = new Date();
    followUp.history.push({
      action: 'Marked as completed',
      performedBy: req.user._id
    });

    await followUp.save();
    await followUp.populate('assignedTo assignedBy', 'name email');

    res.json({
      message: 'Follow-up marked as completed',
      followUp
    });
  } catch (error) {
    res.status(500).json({ message: 'Error completing follow-up', error: error.message });
  }
}; 