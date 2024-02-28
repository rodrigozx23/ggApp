# Use an official Node.js runtime as a parent image
# FROM node:14

# Set the working directory in the container
# WORKDIR /app

# Copy package.json and package-lock.json to the container
# COPY package*.json ./

# Install project dependencies
# RUN npm install

# Copy all the source code to the container
# COPY . .

# Build the React app for production
# RUN npm run build

# Expose the port that your app will run on
# EXPOSE 3000

# Define the command to start your app
# CMD ["npm", "start"]

# ========= STAGE 1: Build Stage  =============
# Use an official Node.js image for building 
#FROM node:lts-alpine AS build

# Create the working directory for the app
#WORKDIR /app

# Copy package.json and package-lock.json (if present) for efficient caching
#COPY package*.json ./

# Install production dependencies 
#RUN npm install

# Copy remaining project files
#COPY . .

# Build the React application
#RUN npm run build

# ========= STAGE 2: Serve Stage =============
# Start with a lightweight Nginx image for serving static files
#FROM nginx:alpine

# Remove default Nginx configuration
#RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy the Nginx configuration (replace with your specific nginx.conf if needed)
#COPY nginx.conf /etc/nginx/conf.d/

# Copy the built application files from the build stage
#COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that Nginx will listen on
#EXPOSE 80

# Define the command to start Nginx
#CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build the React application
FROM node:14 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code and build the application
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the build output to replace the default Nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]