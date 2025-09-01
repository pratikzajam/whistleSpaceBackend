import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    secretKey: {
        type: String,
        required: true,
        index: true // helps faster lookups by secretKey
    },
 
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    randomUsername: {
        type: String,
        required: true,
        trim: true
    }
}, { 
    timestamps: true // ✅ Automatically adds createdAt & updatedAt
});



let Message=mongoose.model("Message", messageSchema);

export default Message


