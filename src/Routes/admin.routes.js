import { signup, login, generateCode, getCode, deleteMessageById } from "../Controllers/admin.controller.js";
import { Router } from "express";
import { requireAdmin } from '../Middleware/auth.js';



const admin = Router();

/**
 * @openapi
 * /api/admin/signup:
 *   post:
 *     summary: Register a new admin organization
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orgName, email, password, confirmPassword]
 *             properties:
 *               orgName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Admin already exists
 */
admin.post("/signup", signup);

/**
 * @openapi
 * /api/admin/login:
 *   post:
 *     summary: Login as admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
admin.post("/login", login);

/**
 * @openapi
 * /api/admin/generatecode:
 *   post:
 *     summary: Generate a new org secret code
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Code generated successfully
 *       401:
 *         description: Unauthorized
 */
admin.post("/generatecode", requireAdmin, generateCode);

/**
 * @openapi
 * /api/admin/getcode:
 *   post:
 *     summary: Get current organization code
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Code returned successfully
 *       401:
 *         description: Unauthorized
 */
admin.post("/getcode", requireAdmin, getCode);

/**
 * @openapi
 * /api/admin/deletemessage:
 *   post:
 *     summary: Delete a message for this organization
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
admin.post("/deletemessage", requireAdmin, deleteMessageById);

export default admin;
