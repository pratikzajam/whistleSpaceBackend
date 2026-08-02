import mongoose from 'mongoose';
const { Schema } = mongoose;

const adminSchema = new Schema({
    orgName: {
        type: String,
        required: true,
        trim: true,
        unique: true

    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    orgCode: {
        type: String
    }

}, { timestamps: true });


let admin = mongoose.model('Admin', adminSchema);

export default admin
