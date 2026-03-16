const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/ai/draft — Generate AI complaint draft
router.post('/draft', async (req, res) => {
    try {
        const { fullName, email, address, sector, subject, description } = req.body;

        if (!fullName || !sector || !subject || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const sectorNames = {
            garbage: 'Garbage & Sanitation',
            electricity: 'Electricity Supply',
            water: 'Water Supply',
            roads: 'Roads & Infrastructure',
            other: 'General',
        };

        const sectorName = sectorNames[sector] || sector;

        const prompt = `You are a civic complaint drafting assistant for a government portal called "JanMitraN". 
Generate a formal, professional civic complaint letter/document based on the following details:

Complainant Name: ${fullName}
Email: ${email}
Address/Location: ${address}
Department: ${sectorName}
Subject: ${subject}
Description of Issue: ${description}

Please generate a well-structured formal complaint document that includes:
1. A proper header with complaint ID (use format JM-DRAFT-XXXX)
2. Date of filing
3. Complainant information
4. Detailed complaint description (expand on the user's description professionally)
5. Expected resolution and timeline
6. Status section
7. Next steps

Make it look official and professional. Use clear formatting with section separators (===).
Keep it concise but thorough. Do NOT include markdown formatting - only plain text.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1500,
        });

        const draft = chatCompletion.choices[0]?.message?.content || 'Failed to generate draft.';
        res.json({ draft });
    } catch (error) {
        console.error('[API] POST /api/ai/draft error:', error);
        res.status(500).json({ error: 'Failed to generate draft' });
    }
});

module.exports = router;
