import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI;

const checkDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log("--- COLLECTIONS START ---");
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`COLLECTION: ${col.name} (${count})`);
        }
        console.log("--- COLLECTIONS END ---");
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};
checkDB();
