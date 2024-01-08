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