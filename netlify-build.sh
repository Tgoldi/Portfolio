#!/bin/bash

# Print Node.js and npm versions for debugging
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install dependencies with specific flags to handle platform issues
npm ci --no-optional

# Handle platform-specific issues by using specific build flags
export NODE_OPTIONS="--max_old_space_size=4096"
export VITE_BUILD_PLATFORM="linux"

# Run the build
npm run build

# Success message
echo "Build completed successfully!" 