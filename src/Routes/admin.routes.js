import { signup, login, generateCode, getCode, deleteMessageById } from "../Controllers/admin.controller.js";
import { Router } from "express";



const admin = Router();

admin.post("/signup", signup);
admin.post("/login", login);
admin.post("/generatecode", generateCode);
admin.post("/getcode", getCode);
admin.post("/deletemessage", deleteMessageById);

export default admin;
