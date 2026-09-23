# Use official Node.js lightweight LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose server port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
