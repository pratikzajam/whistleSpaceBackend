import mongoose from 'mongoose';
const { Schema } = mongoose;

const adminSchema = new Schema({
    orgName: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    orgCode: {
        type: String
    }

});


let admin = mongoose.model('Admin', adminSchema);

export default admin