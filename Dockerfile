# Dockerfile for Shopping List Frontend
# Multi-stage build for optimized production image

# ================================
# Stage 1: Build Stage
# ================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm ci --silent && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ================================
# Stage 2: Production Stage
# ================================
FROM nginx:alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create nginx user and group with specific UID/GID
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G nginx-app nginx-app

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy health check script
COPY docker/healthcheck.sh /healthcheck.sh
RUN chmod +x /healthcheck.sh

# Set proper permissions
RUN chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown nginx-app:nginx-app /var/cache/nginx && \
    chown nginx-app:nginx-app /var/run && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER nginx-app

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /healthcheck.sh

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ================================
# Labels for metadata
# ================================
LABEL maintainer="Shopping List App" \
      description="Production-ready frontend for Shopping List application" \
      version="1.0.0"
