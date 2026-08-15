#!/bin/bash

# FUR4 Playwright Test Suite - AWS Deployment Script
# Target server is supplied through environment variables.

set -e

echo "🚀 Starting FUR4 Playwright Test Suite Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_HOST="${SERVER_HOST:?Set SERVER_HOST to the deployment host}"
SERVER_USER="${SERVER_USER:?Set SERVER_USER to the SSH username}"
REMOTE_DIR="${REMOTE_DIR:-/home/${SERVER_USER}/fur4-playwright}"
DOCKER_IMAGE_NAME="fur4-playwright-tests"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found! Please create it with your Teams webhook URL."
    exit 1
fi

print_status "📋 Checking prerequisites..."

# Check if Docker is installed locally
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed locally. Please install Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not available. Please install Docker Compose first."
    exit 1
fi

print_status "🔧 Setting up remote server..."

# Create remote directory and copy files
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
    # Create directory structure
    mkdir -p ~/fur4-playwright/{logs,test-results,playwright-report}
    
    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
    fi
    
    # Install Docker Compose if not present
    if ! command -v docker-compose &> /dev/null; then
        echo "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    # Install PM2 globally
    if ! command -v pm2 &> /dev/null; then
        echo "Installing PM2..."
        npm install -g pm2
    fi
EOF

print_status "📁 Copying project files to server..."

# Copy project files to server
scp -r . $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

print_status "🐳 Building and starting Docker containers..."

# Build and start containers on remote server
ssh $SERVER_USER@$SERVER_HOST << EOF
    cd $REMOTE_DIR
    
    # Build Docker image
    docker-compose build
    
    # Start containers
    docker-compose up -d
    
    # Wait for containers to be ready
    sleep 10
    
    # Check container status
    docker-compose ps
    
    # Show logs
    echo "Container logs:"
    docker-compose logs --tail=20
EOF

print_status "⏰ Setting up PM2 scheduling..."

# Set up PM2 on the host (not in container for better reliability)
ssh $SERVER_USER@$SERVER_HOST << EOF
    cd $REMOTE_DIR
    
    # Create PM2 ecosystem file for host scheduling
    cat > ecosystem-host.config.js << 'PM2CONFIG'
module.exports = {
  apps: [
    {
      name: 'fur4-playwright-scheduler',
      script: 'docker-compose',
      args: 'run --rm playwright-tests npm run test:teams:full',
      cwd: '$REMOTE_DIR',
      instances: 1,
      autorestart: false,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      cron_restart: '*/15 * * * *', // Every 15 minutes
      log_file: '$REMOTE_DIR/logs/pm2-combined.log',
      out_file: '$REMOTE_DIR/logs/pm2-out.log',
      error_file: '$REMOTE_DIR/logs/pm2-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true
    }
  ]
};
PM2CONFIG
    
    # Start PM2 with the ecosystem file
    pm2 start ecosystem-host.config.js
    
    # Save PM2 configuration
    pm2 save
    
    # Set up PM2 to start on boot
    pm2 startup
    
    # Show PM2 status
    pm2 status
    pm2 logs --lines 10
EOF

print_status "✅ Deployment completed successfully!"

echo ""
echo "📊 Deployment Summary:"
echo "  • Server: $SERVER_HOST"
echo "  • Directory: $REMOTE_DIR"
echo "  • Docker containers: Running"
echo "  • PM2 scheduler: Active (every 15 minutes)"
echo "  • Logs: $REMOTE_DIR/logs/"
echo ""
echo "🔧 Useful commands:"
echo "  • View logs: ssh $SERVER_USER@$SERVER_HOST 'cd $REMOTE_DIR && docker-compose logs -f'"
echo "  • PM2 status: ssh $SERVER_USER@$SERVER_HOST 'pm2 status'"
echo "  • PM2 logs: ssh $SERVER_USER@$SERVER_HOST 'pm2 logs'"
echo "  • Restart tests: ssh $SERVER_USER@$SERVER_HOST 'cd $REMOTE_DIR && docker-compose restart'"
echo ""
echo "🎯 Tests will run every 15 minutes and send Teams notifications on any failures." 