import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connectDatabase = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
};
//# sourceMappingURL=db.js.map