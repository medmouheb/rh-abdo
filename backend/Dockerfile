FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package.json ./
# Copy tsconfig (if custom, else use default)
COPY backend/tsconfig.json ./

# Install dependencies (Mongoose, Express, etc.)
RUN npm install

# Copy source code
COPY backend/src ./src

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
