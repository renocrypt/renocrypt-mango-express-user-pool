// config/db.ts
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error((err as Error).message);
        process.exit(1);
    }
};

export default connectDB;
