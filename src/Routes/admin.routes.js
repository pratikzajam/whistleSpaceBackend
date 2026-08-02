import { signup, login, generateCode, getCode, deleteMessageById } from "../Controllers/admin.controller.js";
import { Router } from "express";
import { requireAdmin } from '../Middleware/auth.js';



const admin = Router();

admin.post("/signup", signup);
admin.post("/login", login);
admin.post("/generatecode", requireAdmin, generateCode);
admin.post("/getcode", requireAdmin, getCode);
admin.post("/deletemessage", requireAdmin, deleteMessageById);

export default admin;
