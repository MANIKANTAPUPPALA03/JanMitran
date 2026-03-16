const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { verifyToken } = require('../middleware/auth');
const { sendComplaintEmail, sendCitizenConfirmationEmail } = require('../services/email');

// POST /api/complaints — Submit a new complaint
router.post('/', async (req, res) => {
    try {
        const { fullName, email, address, sector, subject, description, photoUrl } = req.body;

        if (!fullName || !email || !address || !sector || !subject || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const complaintId = await Complaint.getNextComplaintId();

        const complaint = await Complaint.create({
            complaintId, fullName, email, address, sector, subject, description, photoUrl, status: 'open',
        });

        // Send email to department (non-blocking)
        sendComplaintEmail({ complaintId, fullName, email, address, sector, subject, description, photoUrl })
            .catch((err) => console.error('[API] Department email error:', err));

        // Send confirmation email to citizen (non-blocking)
        sendCitizenConfirmationEmail({ complaintId, fullName, email, sector, subject, description, photoUrl })
            .catch((err) => console.error('[API] Citizen email error:', err));

        res.status(201).json({
            success: true,
            complaint: {
                id: complaint.complaintId,
                name: complaint.fullName,
                sector: complaint.sector,
                subject: complaint.subject,
                description: complaint.description,
                photoUrl: complaint.photoUrl,
                timestamp: complaint.createdAt.toLocaleString('en-IN'),
            },
        });
    } catch (error) {
        console.error('[API] POST /api/complaints error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const ADMIN_ROLES = {
    'garbage.janmitran@gmail.com': 'garbage',
    'electricity.janmitran@gmail.com': 'electricity',
    'water.janmitran@gmail.com': 'water',
    'roads.janmitran@gmail.com': 'roads',
    'others.janmitran@gmail.com': 'other',
    'janmitranproject@gmail.com': 'superadmin'
};

// GET /api/complaints — List all complaints (admin, auth-protected)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { status } = req.query;
        let filter = status && status !== 'all' ? { status } : {};

        // Fetch user email from token
        const userEmail = req.user.email;
        const role = ADMIN_ROLES[userEmail];

        if (!role) {
            return res.status(403).json({ error: 'Unauthorized role' });
        }

        if (role !== 'superadmin') {
            filter.sector = role;
        }

        const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

        res.json({
            role, // Optional: return the role so frontend can know
            complaints: complaints.map((c) => ({
                id: c.complaintId,
                name: c.fullName,
                email: c.email,
                sector: c.sector,
                subject: c.subject,
                description: c.description,
                address: c.address,
                photoUrl: c.photoUrl,
                status: c.status,
                timestamp: c.createdAt.toLocaleString('en-IN'),
            })),
        });
    } catch (error) {
        console.error('[API] GET /api/complaints error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/complaints/stats — Public aggregate stats
router.get('/stats', async (req, res) => {
    try {
        const total = await Complaint.countDocuments();
        const resolved = await Complaint.countDocuments({ status: 'resolved' });
        const open = await Complaint.countDocuments({ status: 'open' });
        const inProgress = await Complaint.countDocuments({ status: 'in-progress' });

        const successRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        // Sector breakdown
        const sectorBreakdown = await Complaint.aggregate([
            { $group: { _id: '$sector', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Monthly trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyTrends = await Complaint.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        res.json({
            total,
            resolved,
            open,
            inProgress,
            successRate,
            sectorBreakdown: sectorBreakdown.map(s => ({ sector: s._id, count: s.count })),
            monthlyTrends: monthlyTrends.map(m => ({
                month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
                count: m.count,
            })),
        });
    } catch (error) {
        console.error('[API] GET /api/complaints/stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/complaints/track/:id — Public complaint tracking
router.get('/track/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ complaintId: req.params.id });

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json({
            complaint: {
                id: complaint.complaintId,
                name: complaint.fullName,
                sector: complaint.sector,
                subject: complaint.subject,
                status: complaint.status,
                photoUrl: complaint.photoUrl,
                timestamp: complaint.createdAt.toLocaleString('en-IN'),
                updatedAt: complaint.updatedAt.toLocaleString('en-IN'),
            },
        });
    } catch (error) {
        console.error('[API] GET /api/complaints/track error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/complaints/:id — Update complaint status
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['open', 'in-progress', 'resolved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const complaint = await Complaint.findOneAndUpdate(
            { complaintId: req.params.id },
            { status },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json({ success: true, complaint: { id: complaint.complaintId, status: complaint.status } });
    } catch (error) {
        console.error('[API] PATCH error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/complaints/:id — Delete a complaint (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const complaint = await Complaint.findOneAndDelete({ complaintId: req.params.id });

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json({ success: true, message: `Complaint ${req.params.id} deleted` });
    } catch (error) {
        console.error('[API] DELETE error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
