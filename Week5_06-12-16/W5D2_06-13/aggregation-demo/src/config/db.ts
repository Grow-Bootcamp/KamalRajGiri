import mongoose from "mongoose";
export const connectToDatabase = async (): Promise<void> => {

    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};