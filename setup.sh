#!/bin/bash

echo "🚀 Setting up Interactive Dashboard..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Setup backend
echo ""
echo "📦 Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in backend directory"
    exit 1
fi

echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Create a simple start script
echo ""
echo "📝 Creating start scripts..."

# Create start-backend.sh
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting backend server..."
cd backend
npm run dev
EOF

# Create start-frontend.sh
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🌐 Starting frontend server..."
cd frontend
python3 -m http.server 8080 2>/dev/null || python -m http.server 8080 2>/dev/null || echo "Please install Python or use a local server to serve the frontend"
EOF

# Make scripts executable
chmod +x start-backend.sh
chmod +x start-frontend.sh

echo "✅ Start scripts created"

# Create a combined start script
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Interactive Dashboard..."
echo "======================================"

# Start backend in background
echo "📦 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend server..."
cd frontend
python3 -m http.server 8080 2>/dev/null || python -m http.server 8080 2>/dev/null || echo "Please install Python or use a local server to serve the frontend"
FRONTEND_PID=$!
cd ..

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT

echo ""
echo "✅ Both servers are running!"
echo "   Backend: http://localhost:3000"
echo "   Frontend: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for background processes
wait
EOF

chmod +x start-all.sh

echo ""
echo "🎉 Setup completed successfully!"
echo "======================================"
echo ""
echo "📋 Available commands:"
echo "   ./start-backend.sh  - Start only the backend server"
echo "   ./start-frontend.sh - Start only the frontend server"
echo "   ./start-all.sh      - Start both servers together"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:8080"
echo "   Backend API: http://localhost:3000/api"
echo "   Health Check: http://localhost:3000/api/health"
echo ""
echo "🔐 Auth token for analytics: sample-token-123"
echo ""
echo "Happy coding! 🚀" 