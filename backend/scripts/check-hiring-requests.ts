
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const checkRequests = async () => {
    await connectDB();

    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const hiringRequests = await mongoose.connection.db.collection('HiringRequest').find({}).toArray();
        console.log(`Found ${hiringRequests.length} HiringRequests.`);
        
        const vacant = hiringRequests.filter((r: any) => r.status === 'VACANT' || r.status === 'IN_PROGRESS' || r.status === 'OPEN');
        console.log(`Found ${vacant.length} 'Vacant' positions (status VACANT/IN_PROGRESS/OPEN).`);
        
        if (vacant.length > 0) {
            console.log('Sample Vacant Position:', vacant[0]);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkRequests();
