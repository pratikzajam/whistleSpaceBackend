import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function moderationMiddleware(req, res, next) {
    const content = req.body.content;

    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent([
            "Analyze if this content is appropriate and respond with either 'SAFE' or 'UNSAFE': " + content
        ]);

        const response = await result.response;
        const text = response.text().toLowerCase();

        if (text.includes('unsafe')) {
            return res.status(403).json({
                status:false,
                messages: "Content flagged as inappropriate",
                data: null
            });
        }

        next();
    } catch (err) {
        console.error('Moderation error:', err);
        res.status(500).json({ error: "Moderation service error" });
    }
}
