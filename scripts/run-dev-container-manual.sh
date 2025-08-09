#!/bin/bash

# Manual script to run the frontend dev container with host networking
# Use this if Docker Compose networking isn't working

echo "🚀 Starting frontend development container with host network..."

# Stop existing container if running
docker stop shopping-list-frontend-manual 2>/dev/null || true
docker rm shopping-list-frontend-manual 2>/dev/null || true

# Build the development image
echo "📦 Building development image..."
docker build -f Dockerfile.dev -t shopping-list-frontend:dev .

# Run the container with host network mode
echo "🔧 Starting container..."
docker run -d \
  --name shopping-list-frontend-manual \
  --network host \
  -v "$(pwd):/app" \
  -v /app/node_modules \
  -e NODE_ENV=development \
  -e VITE_API_URL=http://localhost:3000 \
  shopping-list-frontend:dev

echo "✅ Container started successfully!"
echo "🌐 Frontend available at: http://localhost:5173"
echo "🔍 Backend API at: http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "  View logs:     docker logs -f shopping-list-frontend-manual"
echo "  Stop container: docker stop shopping-list-frontend-manual"
echo "  Enter container: docker exec -it shopping-list-frontend-manual sh"
