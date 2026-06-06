const Lead = require('../models/Lead');

// Helper: build sort object
const buildSort = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const order = sortOrder === 'asc' ? 1 : -1;
  const validFields = ['name', 'email', 'company', 'status', 'createdAt', 'value'];
  const field = validFields.includes(sortBy) ? sortBy : 'createdAt';
  return { [field]: order };
};

// @desc    Get all leads (with pagination, filtering, sorting)
// @route   GET /api/leads
exports.getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { company: regex }];
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(buildSort(sortBy, sortOrder))
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create lead
// @route   POST /api/leads
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead, message: 'Lead created successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A lead with this email already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead, message: 'Lead updated successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get lead statistics
// @route   GET /api/leads/stats
exports.getStats = async (req, res) => {
  try {
    const [statusCounts, totalValue, recentLeads, monthlyTrend] = await Promise.all([
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: null, total: { $sum: '$value' }, avg: { $avg: '$value' } } }]),
      Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
      Lead.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
      ]),
    ]);

    const statusMap = { New: 0, Contacted: 0, Qualified: 0, Converted: 0, Lost: 0 };
    statusCounts.forEach(({ _id, count }) => {
      if (_id in statusMap) statusMap[_id] = count;
    });

    const total = Object.values(statusMap).reduce((a, b) => a + b, 0);
    const conversionRate = total > 0 ? ((statusMap.Converted / total) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        statusCounts: statusMap,
        total,
        conversionRate: parseFloat(conversionRate),
        totalValue: totalValue[0]?.total || 0,
        avgValue: totalValue[0]?.avg ? Math.round(totalValue[0].avg) : 0,
        recentLeads,
        monthlyTrend: monthlyTrend.reverse(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Search leads
// @route   GET /api/leads/search?q=...
exports.searchLeads = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) {
      return res.json({ success: true, data: [] });
    }
    const regex = new RegExp(q.trim(), 'i');
    const leads = await Lead.find({
      $or: [{ name: regex }, { email: regex }, { company: regex }],
    })
      .limit(20)
      .lean();
    res.json({ success: true, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
