# # Use Node.js 18 as the base image
# FROM node:18-alpine

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Install NestJS CLI globally
# RUN yarn global add @nestjs/cli

# # Copy package.json and yarn.lock to the working directory
# COPY package.json yarn.lock ./

# # Install dependencies
# RUN yarn install --frozen-lockfile --production

# # Copy the source code to the container
# COPY . .

# # Build the NestJS application
# RUN nest build

# # Expose the port your NestJS app is listening on
# EXPOSE 3000

# # Command to run the application
# CMD ["node", "dist/main"]
# Use Node 18 base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy the rest of the application
COPY . .

# Build the NestJS app
RUN yarn build

# Expose the app's port
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start:prod"]