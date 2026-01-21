#!/bin/sh

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
sleep 5

# Run seed if needed
if [ "$SEED_DB" = "true" ]; then
  echo "Seeding database..."
  npm run seed
fi

# Start the server
echo "Starting backend server..."
exec node dist/server.js
