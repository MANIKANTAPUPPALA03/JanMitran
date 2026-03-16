const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');

// POST /api/auth/verify — Verify Firebase ID token
router.post('/verify', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ error: 'ID token is required' });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        res.json({ success: true, uid: decodedToken.uid, email: decodedToken.email });
    } catch (error) {
        console.error('[API] POST /api/auth/verify error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
