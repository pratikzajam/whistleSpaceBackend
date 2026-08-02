import Admin from '../Models/admin.model.js';
import Message from '../Models/message.model.js';
import { randomBytes } from 'node:crypto';

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
