# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Set environment variables for Vite
# Set build-time arguments (these can be overridden at build time)
ARG VITE_BACKEND_URL="http://test.local/api"
ARG VITE_WEBSOCKET_URL="ws://test.local/ws"


# Make sure Vite picks up these env variables during build
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_WEBSOCKET_URL=${VITE_WEBSOCKET_URL}

RUN npm install -g http-server

# Build the application with the correct environment variables
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]


