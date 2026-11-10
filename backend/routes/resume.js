/**
 * Resume Builder API Routes - DISABLED
 * Resume builder functionality has been removed
 */

const express = require('express');
const router = express.Router();

// All resume routes disabled - functionality removed
router.all('*', (req, res) => {
  res.status(404).json({
    error: 'Resume builder functionality has been removed',
    message: 'This feature is no longer available'
  });
});




module.exports = router;


