
const mongoose = require('mongoose');

const sourceUri = 'mongodb+srv://mohamedmouheb:bLIRw4DXLTDWVDVa@cluster0.kugwfsv.mongodb.net/smartMadinaty?retryWrites=true&w=majority';
const destUri = 'mongodb+srv://mohamedmouheb:bLIRw4DXLTDWVDVa@cluster0.kugwfsv.mongodb.net/rh_dashboard?retryWrites=true&w=majority';

async function migrate() {
  let sourceConn = null;
  let destConn = null;

  try {
    console.log('Connecting to Source DB (smartMadinaty)...');
    sourceConn = await mongoose.createConnection(sourceUri).asPromise();
    console.log('Connected to Source.');

    console.log('Connecting to Destination DB (rh_dashboard)...');
    destConn = await mongoose.createConnection(destUri).asPromise();
    console.log('Connected to Destination.');

    const collections = await sourceConn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections to migrate.`);

    for (const col of collections) {
      const colName = col.name;
      console.log(`Processing collection: ${colName}...`);

      const docs = await sourceConn.db.collection(colName).find().toArray();
      if (docs.length === 0) {
        console.log(`  - No documents found in ${colName}. Skipping.`);
        continue;
      }

      console.log(`  - Found ${docs.length} documents. Copying...`);
      
      // Check if destination collection already has data to avoid duplicates/errors if ran multiple times
      // For a fresh migration, we might want to drop destination collection or just insert. 
      // User said "change the database ... call it what you want and add the old data". 
      // Assuming new DB is empty.
      
      try {
        await destConn.db.collection(colName).insertMany(docs);
        console.log(`  - Successfully copied ${docs.length} documents to ${colName}.`);
      } catch (err) {
        if (err.code === 11000) {
           console.warn(`  - Warning: Duplicate keys found in ${colName}. Some data might already exist.`);
        } else {
           console.error(`  - Error copying ${colName}:`, err);
        }
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
