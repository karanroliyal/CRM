const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/follow-up.controller');
const { auth, checkPermission } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(auth);

// Follow-up routes
router.post('/', 
  checkPermission('manage_follow_ups'),
  followUpController.createFollowUp
);

router.get('/',
  checkPermission('manage_follow_ups'),
  followUpController.getFollowUps
);

router.get('/:id',
  checkPermission('manage_follow_ups'),
  followUpController.getFollowUpById
);

router.put('/:id',
  checkPermission('manage_follow_ups'),
  followUpController.updateFollowUp
);

router.delete('/:id',
  checkPermission('manage_follow_ups'),
  followUpController.deleteFollowUp
);

router.post('/:id/notes',
  checkPermission('manage_follow_ups'),
  followUpController.addNote
);

router.post('/:id/complete',
  checkPermission('manage_follow_ups'),
  followUpController.completeFollowUp
);

module.exports = router; 