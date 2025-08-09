#!/bin/bash

# Development helper script for Shopping List Frontend
# Usage: ./scripts/dev.sh [command]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Commands
case "$1" in
    "build-dev")
        log_info "Building development Docker image..."
        docker build -f Dockerfile.dev -t shopping-list-frontend:dev .
        log_success "Development image built successfully!"
        ;;
    
    "start-dev")
        log_info "Starting development environment..."
        docker-compose -f docker-compose.dev.yml up -d
        log_success "Development environment started!"
        log_info "Frontend: http://localhost:5173"
        log_info "Backend: http://localhost:3000"
        log_info "Database: localhost:5433"
        ;;
    
    "start-frontend-only")
        log_info "Starting frontend development container only..."
        docker-compose -f docker-compose.frontend-dev.yml up -d
        log_success "Frontend development container started!"
        log_info "Frontend: http://localhost:5173"
        log_warning "Make sure your backend is running on http://localhost:3000"
        ;;
    
    "stop-dev")
        log_info "Stopping development environment..."
        docker-compose -f docker-compose.dev.yml down
        docker-compose -f docker-compose.frontend-dev.yml down
        log_success "Development environment stopped!"
        ;;
    
    "restart-dev")
        log_info "Restarting development environment..."
        ./scripts/dev.sh stop-dev
        ./scripts/dev.sh start-dev
        ;;
    
    "logs")
        service=${2:-"frontend-dev"}
        log_info "Showing logs for $service..."
        docker-compose -f docker-compose.dev.yml logs -f $service
        ;;
    
    "shell")
        service=${2:-"frontend-dev"}
        log_info "Opening shell in $service container..."
        docker-compose -f docker-compose.dev.yml exec $service /bin/sh
        ;;
    
    "clean")
        log_info "Cleaning up development environment..."
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose -f docker-compose.frontend-dev.yml down -v
        docker rmi shopping-list-frontend:dev 2>/dev/null || true
        log_success "Development environment cleaned!"
        ;;
    
    "reset")
        log_info "Resetting development environment (clean + rebuild)..."
        ./scripts/dev.sh clean
        ./scripts/dev.sh build-dev
        ./scripts/dev.sh start-dev
        ;;
    
    "test")
        log_info "Running tests in development container..."
        docker-compose -f docker-compose.dev.yml exec frontend-dev npm test
        ;;
    
    "lint")
        log_info "Running linter in development container..."
        docker-compose -f docker-compose.dev.yml exec frontend-dev npm run lint
        ;;
    
    "install")
        package=${2}
        if [ -z "$package" ]; then
            log_error "Please specify a package to install"
            exit 1
        fi
        log_info "Installing $package in development container..."
        docker-compose -f docker-compose.dev.yml exec frontend-dev npm install $package
        ;;
    
    "devcontainer")
        log_info "Starting development container for VSCode..."
        docker-compose -f .devcontainer/docker-compose.yml up -d frontend-dev
        log_success "Dev container started! Use VSCode 'Attach to Running Container'"
        log_info "Container name: shopping-list-frontend-devcontainer"
        ;;
    
    "devcontainer-db")
        log_info "Starting development container with database..."
        docker-compose -f .devcontainer/docker-compose.yml --profile database up -d
        log_success "Dev container with database started!"
        ;;
    
    "status")
        log_info "Development environment status:"
        docker-compose -f docker-compose.dev.yml ps
        echo ""
        log_info "Dev container status:"
        docker-compose -f .devcontainer/docker-compose.yml ps
        ;;
    
    "help"|*)
        echo "Shopping List Frontend Development Helper"
        echo ""
        echo "Usage: ./scripts/dev.sh [command]"
        echo ""
        echo "Available commands:"
        echo "  build-dev           Build development Docker image"
        echo "  start-dev           Start full development environment"
        echo "  start-frontend-only Start only frontend container"
        echo "  stop-dev            Stop development environment"
        echo "  restart-dev         Restart development environment"
        echo "  logs [service]      Show logs for service (default: frontend-dev)"
        echo "  shell [service]     Open shell in service container"
        echo "  clean               Clean up development environment"
        echo "  reset               Clean, rebuild, and restart"
        echo "  test                Run tests"
        echo "  lint                Run linter"
        echo "  install [package]   Install npm package"
        echo "  devcontainer        Start dev container for VSCode"
        echo "  devcontainer-db     Start dev container with database"
        echo "  status              Show container status"
        echo "  help                Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./scripts/dev.sh start-dev"
        echo "  ./scripts/dev.sh logs frontend-dev"
        echo "  ./scripts/dev.sh shell backend-dev"
        echo "  ./scripts/dev.sh install axios"
        ;;
esac
