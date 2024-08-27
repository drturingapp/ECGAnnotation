# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Define a volume to mount the source code
VOLUME ["/app"]

# Expose the port that the application listens on
EXPOSE 3000

# Start the Node.js application using nodemon
CMD ["nodemon", "index.js"]
