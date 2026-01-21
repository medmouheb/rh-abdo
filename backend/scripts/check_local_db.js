
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017';

async function checkLocalDb() {
  try {
    console.log('Connecting to Local DB...');
    await mongoose.connect(uri);
    console.log('Connected!');

    const admin = new mongoose.mongo.Admin(mongoose.connection.db);
    const result = await admin.listDatabases();
    console.log('Databases:', result.databases);

  } catch (error) {
    console.error('Error connecting to Local DB:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkLocalDb();
