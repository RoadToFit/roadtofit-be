# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:18-slim

# Install prisma dependencies
RUN apt-get update -y && apt-get install -y openssl

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND yarn.lock are copied.
# Copying this separately prevents re-running yarn install on every code change.
COPY package.json package-lock.json tsconfig.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Transpile TypeScript to JavaScript.
RUN npm run build

# Set the environment to production
ENV NODE_ENV production

# Expose port
EXPOSE 4000

# Generate prisma client
RUN npx prisma generate

# Run the web service on container startup.
CMD [ "node", "dist/server.js" ]