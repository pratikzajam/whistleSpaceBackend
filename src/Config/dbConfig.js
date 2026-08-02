import mongoose from 'mongoose';

let connectionPromise;

export default function dbConnect() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is required');
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGODB_URI);
    }

    return connectionPromise;
}
