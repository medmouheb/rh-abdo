import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_system';

async function seed() {
    try {
        // Connect to database
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if users already exist
        const existingUsers = await User.countDocuments();
        if (existingUsers > 0) {
            console.log('⚠️  Users already exist. Skipping seed.');
            await mongoose.connection.close();
            return;
        }

        // Create default users
        const users = [
            {
                username: 'admin',
                password: 'admin123',
                role: 'rh',
            },
            {
                username: 'manager1',
                password: 'manager123',
                role: 'manager',
            },
            {
                username: 'directeur1',
                password: 'directeur123',
                role: 'directeur',
            },
        ];

        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            console.log(`✅ Created user: ${userData.username} (${userData.role})`);
        }

        console.log('🎉 Seed completed successfully!');
        console.log('\n📝 Default credentials:');
        console.log('   RH: admin / admin123');
        console.log('   Manager: manager1 / manager123');
        console.log('   Directeur: directeur1 / directeur123');

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
