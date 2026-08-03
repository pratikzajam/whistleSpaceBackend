import mongoose from 'mongoose';
import Admin from '../Models/admin.model.js';
import Message from '../Models/message.model.js';
import { randomBytes } from 'node:crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';

function anonymousUsername() {
    return `Whistleblower-${randomBytes(5).toString('hex')}`;
}

export async function verifyCode(req, res) {
    try {
        const { orgCode } = req.body || {};
        if (!orgCode) {
            return res.status(400).json({ status: false, message: 'Organization code is required', data: null });
        }
        const organization = await Admin.findOne({ orgCode }).select('orgName');
        if (!organization) {
            return res.status(404).json({ status: false, message: 'Organization code does not exist', data: null });
        }
        return res.status(200).json({ status: true, message: 'Code verified successfully', data: { orgCode, companyName: organization.orgName, userName: anonymousUsername() } });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Unable to verify code', data: null });
    }
}

export async function addMessage(req, res) {
    try {
        const { secretKey, content, randomUsername } = req.body || {};
        if (!secretKey || !content || !randomUsername) {
            return res.status(400).json({ status: false, message: 'All fields are required', data: null });
        }
        const organization = await Admin.exists({ orgCode: secretKey });
        if (!organization) {
            return res.status(404).json({ status: false, message: 'Organization code does not exist', data: null });
        }
        await Message.create({ secretKey, content, randomUsername });
        return res.status(201).json({ status: true, message: 'Message added successfully', data: null });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Unable to add message', data: null });
    }
}

export async function getMessagesBySecretCode(req, res) {
    try {
        const { secretKey } = req.body || {};
        if (!secretKey) {
            return res.status(400).json({ status: false, message: 'Organization code is required', data: null });
        }
        const messages = await Message.find({ secretKey }).select('-__v').sort({ createdAt: -1 });
        if (!messages.length) {
            return res.status(404).json({ status: false, message: 'No messages found', data: null });
        }
        return res.status(200).json({ status: true, message: 'Messages fetched successfully', data: { messages } });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Unable to fetch messages', data: null });
    }
}


export async function createReply(req, res) {
    try {
        const { parentId, content, randomUsername, secretKey } = req.body || {};

        if (!parentId) {
            return res.status(400).json({ status: false, message: 'Parent message ID is required', data: null });
        }
        if (!mongoose.isValidObjectId(parentId)) {
            return res.status(400).json({ status: false, message: 'Invalid parent message ID format', data: null });
        }
        if (!content?.trim()) {
            return res.status(400).json({ status: false, message: 'Content is required', data: null });
        }
        if (!randomUsername?.trim()) {
            return res.status(400).json({ status: false, message: 'Username is required', data: null });
        }

        const parent = await Message.findById(parentId);
        if (!parent) {
            return res.status(404).json({ status: false, message: 'Parent message not found', data: null });
        }

        // Slack-style flat threading: always attach to the thread root.
        // If the target message is itself a reply, use its parentMessage (the root).
        // If it's already the root (parentMessage === null), use its own _id.
        const rootId = parent.parentMessage ?? parent._id;

        const reply = await Message.create({
            content,
            randomUsername,
            secretKey: secretKey || parent.secretKey,
            parentMessage: rootId,
        });

        // Increment replyCount on the root message, not the intermediate reply.
        await Message.findByIdAndUpdate(rootId, { $inc: { replyCount: 1 } });

        return res.status(201).json({ status: true, message: 'Reply created successfully', data: { reply } });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Unable to create reply', data: null });
    }
}


export async function getThreadsBySecretCode(req, res) {
    try {
        const { secretKey } = req.body || {};
        if (!secretKey) {
            return res.status(400).json({ status: false, message: 'Organization code is required', data: null });
        }

        const threads = await Message.aggregate([
            { $match: { secretKey, parentMessage: null } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'parentMessage',
                    as: 'replies',
                },
            },
            {
                $addFields: {
                    replies: {
                        $sortArray: { input: '$replies', sortBy: { createdAt: 1 } },
                    },
                },
            },
            {
                $project: {
                    __v: 0,
                    'replies.__v': 0,
                },
            },
        ]);

        if (!threads.length) {
            return res.status(404).json({ status: false, message: 'No threads found', data: null });
        }

        return res.status(200).json({ status: true, message: 'Threads fetched successfully', data: { threads } });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Unable to fetch threads', data: null });
    }
}



export async function improveReply(req, res) {
    try {
        const { userMessage } = req.body || {};

        console.log(userMessage)

        if (!userMessage?.trim()) {
            return res.status(400).json({
                status: false,
                message: "User message is required",
                data: null,
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
You are an AI writing assistant.

Improve the user's message while preserving its original meaning.

Rules:
- Generate exactly 3 improved versions.
- Keep the intent unchanged.
- Correct grammar and spelling.
- Make the message sound natural.
- Do not add new information.
- Return ONLY valid JSON in this format:

{
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}

User Message:
"${userMessage}"
`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        let suggestions;

        try {
            // Remove markdown if Gemini wraps JSON in ```json
            const cleaned = response
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            suggestions = JSON.parse(cleaned);
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: "Failed to parse AI response",
                data: response,
            });
        }

        return res.status(200).json({
            status: true,
            message: "Reply suggestions generated successfully",
            data: suggestions.suggestions,
        });
    } catch (error) {
        console.error("Improve Reply Error:", error);

        return res.status(500).json({
            status: false,
            message: "You Have hit rate limits of AI model, please try again after some time",
            data: null,
        });
    }
}
