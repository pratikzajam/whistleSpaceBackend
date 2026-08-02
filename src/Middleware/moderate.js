import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();


export async function moderationMiddleware(req, res, next) {
    const content = req.body.content;

    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ error: 'Moderation service is not configured' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

        const result = await model.generateContent([
            `Classify the text between <content> tags. Reply only SAFE or UNSAFE. <content>${content}</content>`
        ]);

        const response = await result.response;
        const text = response.text().trim().toUpperCase();

        if (text !== 'SAFE') {
            return res.status(403).json({
                status:false,
                messages: "Content flagged as inappropriate",
                data: null
            });
        }

        next();
    } catch (err) {
        console.error('Moderation error:', err);
        res.status(503).json({ error: "Moderation service unavailable" });
    }
}
