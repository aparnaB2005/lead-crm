const express = require('express');
const router = express.Router();
const {getLeads,getLead,createLead,updateLead,deleteLead,getStats,searchLeads} = require('../controllers/leadController');

router.get('/stats', getStats);
router.get('/search', searchLeads);

router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLead).put(updateLead).delete(deleteLead);

module.exports = router;
