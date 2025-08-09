#!/bin/bash

# Toggle Mock API Script
# This script helps you easily switch between real and mock API modes

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env.local"

show_help() {
    echo "Usage: $0 [enable|disable|status]"
    echo ""
    echo "Commands:"
    echo "  enable  - Enable mock API (sets VITE_USE_MOCK_API=true)"
    echo "  disable - Disable mock API (removes VITE_USE_MOCK_API or sets to false)"
    echo "  status  - Show current mock API status"
    echo ""
    echo "This will create/modify .env.local in the project root."
}

get_current_status() {
    if [ -f "$ENV_FILE" ] && grep -q "VITE_USE_MOCK_API=true" "$ENV_FILE"; then
        echo "enabled"
    else
        echo "disabled"
    fi
}

enable_mock() {
    # Create .env.local if it doesn't exist
    if [ ! -f "$ENV_FILE" ]; then
        touch "$ENV_FILE"
    fi
    
    # Remove existing VITE_USE_MOCK_API line if present
    sed -i.bak '/^VITE_USE_MOCK_API=/d' "$ENV_FILE"
    
    # Add VITE_USE_MOCK_API=true
    echo "VITE_USE_MOCK_API=true" >> "$ENV_FILE"
    
    echo "✅ Mock API enabled"
    echo "💡 Restart your development server for changes to take effect"
}

disable_mock() {
    if [ -f "$ENV_FILE" ]; then
        # Remove VITE_USE_MOCK_API line
        sed -i.bak '/^VITE_USE_MOCK_API=/d' "$ENV_FILE"
        
        # Clean up backup file
        rm -f "$ENV_FILE.bak"
    fi
    
    echo "✅ Mock API disabled (will use real backend API)"
    echo "💡 Restart your development server for changes to take effect"
}

show_status() {
    local status=$(get_current_status)
    echo "Mock API Status: $status"
    
    if [ "$status" = "enabled" ]; then
        echo "📦 Frontend will use mock data instead of backend API"
    else
        echo "🔗 Frontend will connect to real backend API"
        echo "   - In dev container: http://host.docker.internal:3000"
        echo "   - On host: proxy via /api -> http://localhost:3000"
    fi
}

case "$1" in
    enable)
        enable_mock
        ;;
    disable)
        disable_mock
        ;;
    status)
        show_status
        ;;
    *)
        show_help
        ;;
esac
