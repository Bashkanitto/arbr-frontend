# Use official node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Clear npm cache, set the npm registry, and install dependencies with legacy peer dependencies
RUN npm config set registry https://registry.npmjs.org/ && npm cache clean --force && npm install --legacy-peer-deps

# Copy all files
COPY . .

# Expose port and run the app
EXPOSE 3000
CMD ["npm", "start"]
