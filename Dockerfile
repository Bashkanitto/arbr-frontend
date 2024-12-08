# Use official node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Clear npm cache and install dependencies with legacy peer dependencies
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copy all files
COPY . .

# Expose port and run the app
EXPOSE 3000
CMD ["npm", "start"]
