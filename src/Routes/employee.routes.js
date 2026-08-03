import { verifyCode, addMessage, getMessagesBySecretCode, createReply, getThreadsBySecretCode, improveReply } from "../Controllers/employee.controller.js";
import { Router } from "express";
import { moderationMiddleware } from '../Middleware/moderate.js'

const user = Router();

/**
 * @openapi
 * /api/user/verifycode:
 *   post:
 *     summary: Validate a secret org code and return a generated anonymous username
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orgCode]
 *             properties:
 *               orgCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code verified successfully
 *       404:
 *         description: Invalid organization code
 */
user.post("/verifycode", verifyCode);

/**
 * @openapi
 * /api/user/addmessage:
 *   post:
 *     summary: Submit a whistleblower message to an organization
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [secretKey, content, randomUsername]
 *             properties:
 *               secretKey:
 *                 type: string
 *               content:
 *                 type: string
 *               randomUsername:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message added successfully
 *       400:
 *         description: Missing fields
 */
user.post("/addmessage", moderationMiddleware, addMessage);

/**
 * @openapi
 * /api/user/getmessages:
 *   post:
 *     summary: Fetch all messages submitted for a given organization code
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [secretKey]
 *             properties:
 *               secretKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Messages returned successfully
 *       404:
 *         description: No messages found
 */
user.post("/getmessages", getMessagesBySecretCode);

/**
 * @openapi
 * /api/user/createreply:
 *   post:
 *     summary: Create a reply on an existing whistleblower message thread
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [parentId, content, randomUsername]
 *             properties:
 *               parentId:
 *                 type: string
 *                 description: ID of the parent message being replied to
 *               content:
 *                 type: string
 *               randomUsername:
 *                 type: string
 *               secretKey:
 *                 type: string
 *                 description: Optional organization secret key; falls back to the parent message secret key
 *     responses:
 *       201:
 *         description: Reply created successfully
 *       400:
 *         description: Required data missing or invalid
 *       404:
 *         description: Parent message not found
 */
user.post("/createreply", moderationMiddleware, createReply);

/**
 * @openapi
 * /api/user/getthreads:
 *   post:
 *     summary: Fetch all top-level message threads for an organization
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [secretKey]
 *             properties:
 *               secretKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Threads returned successfully
 *       404:
 *         description: No threads found
 */
user.post("/getthreads", getThreadsBySecretCode);

/**
 * @openapi
 * /api/user/improveUserMessage:
 *   post:
 *     summary: Improve a user's message into 3 polished suggestions
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userMessage]
 *             properties:
 *               userMessage:
 *                 type: string
 *                 example: I want to report a safety issue that has been happening for weeks.
 *     responses:
 *       200:
 *         description: Suggestions generated successfully
 *       400:
 *         description: User message is required
 *       500:
 *         description: Failed to generate suggestions
 */
user.post("/improveUserMessage", improveReply);

export default user;
