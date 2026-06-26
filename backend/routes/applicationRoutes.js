const express = require('express');
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/mine', protect, authorize('seeker'), getMyApplications);
router.post('/:jobId/apply', protect, authorize('seeker'), upload.single('resume'), applyJob);
router.get('/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

module.exports = router;
