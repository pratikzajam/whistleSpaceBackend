import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export async function moderationMiddleware(req, res, next) {
    const content = req.body.content;

    if (!content) {
        return res.status(400).json({ status: false, message: "Content is required", data: null });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ status: false, message: 'Moderation service is not configured', data: null });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

        const result = await model.generateContent([
            `Classify the text between <content> tags. Reply only SAFE or UNSAFE. <content>${content}</content>`
        ]);

        const response = await result.response;
        const text = response.text().trim().toUpperCase();

        if (text !== 'SAFE') {
            return res.status(403).json({
                status: false,
                message: "Content flagged as inappropriate or unsafe",
                data: null
            });
        }

        next();
    } catch (err) {
        console.error('Moderation error:', err);
        res.status(503).json({ status: false, message: "Moderation service unavailable", data: null });
    }
}
