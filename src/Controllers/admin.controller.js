import Admin from '../Models/admin.model.js';
import Message from '../Models/message.model.js';
import bcrypt from 'bcryptjs';
import owasp from 'owasp-password-strength-test';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';

export async function signup(req, res) {
    try {
        const { orgName, email, password, confirmPassword } = req.body || {};
        if (!orgName || !email || !password || !confirmPassword) {
            return res.status(400).json({ status: false, message: 'All fields are required', data: null });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ status: false, message: 'Passwords do not match', data: null });
        }
        const result = owasp.test(password);
        if (!result.strong) {
            return res.status(400).json({ status: false, message: result.errors, data: null });
        }
        const existing = await Admin.findOne({ $or: [{ email }, { orgName }] });
        if (existing) {
            return res.status(409).json({ status: false, message: 'Email or organization already exists', data: null });
        }
        const passwordHash = await bcrypt.hash(password, 12);
        await Admin.create({ orgName, email, password: passwordHash });
        return res.status(201).json({ status: true, message: 'Admin created successfully', data: null });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Unable to create admin', data: null });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email and password are required', data: null });
        }
        const account = await Admin.findOne({ email }).select('+password');
        if (!account || !(await bcrypt.compare(password, account.password))) {
            return res.status(401).json({ status: false, message: 'Invalid email or password', data: null });
        }
        if (!process.env.SECRET_KEY) {
            return res.status(500).json({ status: false, message: 'Server authentication is not configured', data: null });
        }
        const token = jwt.sign({ id: account._id.toString(), email: account.email, orgName: account.orgName }, process.env.SECRET_KEY, { expiresIn: '8h' });
        return res.status(200).json({ status: true, message: 'Logged in successfully', data: { token } });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Unable to log in', data: null });
    }
}

export async function generateCode(req, res) {
    try {
        const code = randomBytes(24).toString('base64url');
        await Admin.findByIdAndUpdate(req.admin.id, { orgCode: code }, { runValidators: true });
        return res.status(200).json({ status: true, message: 'Code generated successfully', data: { code } });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Unable to generate code', data: null });
    }
}

export async function getCode(req, res) {
    try {
        const account = await Admin.findById(req.admin.id).select('orgCode');
        if (!account?.orgCode) {
            return res.status(404).json({ status: false, message: 'Code not found', data: null });
        }
        return res.status(200).json({ status: true, message: 'Code fetched successfully', data: { code: account.orgCode } });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Unable to fetch code', data: null });
    }
}

export async function deleteMessageById(req, res) {
    try {
        const { id } = req.body || {};
        if (!id) {
            return res.status(400).json({ status: false, message: 'Message ID is required', data: null });
        }
        const account = await Admin.findById(req.admin.id).select('orgCode');
        const result = await Message.deleteOne({ _id: id, secretKey: account?.orgCode });
        if (!result.deletedCount) {
            return res.status(404).json({ status: false, message: 'Message not found', data: null });
        }
        return res.status(200).json({ status: true, message: 'Message deleted successfully', data: null });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Unable to delete message', data: null });
    }
}
