import { verifyCode, addMessage,getMessagesBySecretCode } from "../Controllers/employee.controller.js";
import { Router } from "express";
import {moderationMiddleware} from '../Middleware/moderate.js'
import rateLimit from 'express-rate-limit';


const user = Router();


const messageLimit = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });

user.post("/verifycode", verifyCode);
user.post("/addmessage", messageLimit, moderationMiddleware, addMessage);
user.post("/getmessages", getMessagesBySecretCode);


export default user;
