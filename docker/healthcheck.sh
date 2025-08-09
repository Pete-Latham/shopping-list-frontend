#!/bin/sh
# Health check script for Shopping List Frontend

# Check if nginx is responding
if wget --no-verbose --tries=1 --spider http://localhost/health 2>/dev/null; then
    echo "Frontend is healthy"
    exit 0
else
    echo "Frontend health check failed"
    exit 1
fi
