import { verifyCode, addMessage,getMessagesBySecretCode } from "../Controllers/employee.controller.js";
import { Router } from "express";
import {moderationMiddleware} from '../Middleware/moderate.js'


const user = Router();


user.post("/verifycode", verifyCode);
user.post("/addmessage", moderationMiddleware,addMessage);
user.post("/getmessages", getMessagesBySecretCode);


export default user;
