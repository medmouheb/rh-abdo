
const mongoose = require('mongoose');

const sourceUri = 'mongodb://localhost:27017/hr_system';
const destUri = 'mongodb+srv://mohamedmouheb:bLIRw4DXLTDWVDVa@cluster0.kugwfsv.mongodb.net/rh_dashboard?retryWrites=true&w=majority';

async function migrate() {
  let sourceConn = null;
  let destConn = null;

  try {
    console.log('Connecting to Local Source DB (hr_system)...');
    sourceConn = await mongoose.createConnection(sourceUri).asPromise();
    console.log('Connected to Source.');

    console.log('Connecting to Remote Destination DB (rh_dashboard)...');
    destConn = await mongoose.createConnection(destUri).asPromise();
    console.log('Connected to Destination.');

    // 1. Clear Destination
    console.log('Clearing destination database...');
    const destCollections = await destConn.db.listCollections().toArray();
    for (const col of destCollections) {
        await destConn.db.collection(col.name).drop();
        console.log(`- Dropped collection: ${col.name}`);
    }
    console.log('Destination cleared.');

    // 2. Migrate
    const sourceCollections = await sourceConn.db.listCollections().toArray();
    console.log(`Found ${sourceCollections.length} collections to migrate from local.`);

    for (const col of sourceCollections) {
      const colName = col.name;
      // Skip system collections if any
      if (colName.startsWith('system.')) continue;

      console.log(`Processing collection: ${colName}...`);

      const docs = await sourceConn.db.collection(colName).find().toArray();
      if (docs.length === 0) {
        console.log(`  - No documents found in ${colName}. Skipping.`);
        continue;
      }

      console.log(`  - Found ${docs.length} documents. Copying...`);
      
      try {
        await destConn.db.collection(colName).insertMany(docs);
        console.log(`  - Successfully copied ${docs.length} documents to ${colName}.`);
      } catch (err) {
         console.error(`  - Error copying ${colName}:`, err);
      }
    }

    console.log('Migration completed successfully.');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (sourceConn) await sourceConn.close();
    if (destConn) await destConn.close();
  }
}

migrate();
