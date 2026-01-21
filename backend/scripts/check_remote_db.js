
const mongoose = require('mongoose');

const uri = 'mongodb+srv://mohamedmouheb:bLIRw4DXLTDWVDVa@cluster0.kugwfsv.mongodb.net/smartMadinaty?retryWrites=true&w=majority';

async function checkDb() {
  try {
    console.log('Connecting to remote DB...');
    await mongoose.connect(uri);
    console.log('Connected!');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections.`);

    if (collections.length === 0) {
      console.log('Database is empty.');
    } else {
        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} documents`);
        }
    }
  } catch (error) {
    console.error('Error connecting to DB:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDb();
