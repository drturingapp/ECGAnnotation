# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Install system dependencies required for canvas (if needed)
RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev

  # Set the NODE_OPTIONS environment variable
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy the entire frontend directory into the container
COPY . .

# Install the dependencies
RUN npm install --loglevel=error

# Build the React.js application
RUN npm run build

# Expose the port that the application listens on
EXPOSE 3001

# Start a simple web server to serve the built React.js files
CMD [ "npx", "serve", "-s", "build" ]
