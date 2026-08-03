import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    secretKey: {
        type: String,
        required: true,
        index: true
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
    },

    parentMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
        index: true
    },

    replyCount: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

export default Message;