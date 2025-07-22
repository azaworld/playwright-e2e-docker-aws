# Use Node.js 18 as base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libnss3 \
    libnspr4 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libatspi2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcb1 \
    libpangocairo-1.0-0 \
    libcairo-gobject2 \
    libcairo2 \
    libatk1.0-0 \
    libgdk-pixbuf2.0-0 \
    libpango-1.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy the rest of the application files
COPY . /app

# Build the application
# RUN npm run build

# Set the default command
CMD ["npm", "start"]