import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
    const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!token) {
        return res.status(401).json({ status: false, message: 'Authentication is required', data: null });
    }

    if (!process.env.SECRET_KEY) {
        return res.status(500).json({ status: false, message: 'Server authentication is not configured', data: null });
    }

    try {
        req.admin = jwt.verify(token, process.env.SECRET_KEY);
        return next();
    } catch {
        return res.status(401).json({ status: false, message: 'Invalid or expired token', data: null });
    }
}
