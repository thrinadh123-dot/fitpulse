@echo off
echo 🚀 Setting up Interactive Dashboard...
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

REM Setup backend
echo.
echo 📦 Setting up backend...
cd backend

if not exist "package.json" (
    echo ❌ package.json not found in backend directory
    pause
    exit /b 1
)

echo Installing backend dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Backend dependencies installed successfully
) else (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

cd ..

REM Create start scripts
echo.
echo 📝 Creating start scripts...

REM Create start-backend.bat
echo @echo off > start-backend.bat
echo echo 🚀 Starting backend server... >> start-backend.bat
echo cd backend >> start-backend.bat
echo npm run dev >> start-backend.bat
echo pause >> start-backend.bat

REM Create start-frontend.bat
echo @echo off > start-frontend.bat
echo echo 🌐 Starting frontend server... >> start-frontend.bat
echo cd frontend >> start-frontend.bat
echo echo Please open index.html in your browser or use a local server >> start-frontend.bat
echo echo You can use Live Server extension in VS Code or Python: python -m http.server 8080 >> start-frontend.bat
echo pause >> start-frontend.bat

echo ✅ Start scripts created

echo.
echo 🎉 Setup completed successfully!
echo ======================================
echo.
echo 📋 Available commands:
echo    start-backend.bat  - Start only the backend server
echo    start-frontend.bat - Start only the frontend server
echo.
echo 🌐 Access your application:
echo    Frontend: Open frontend/index.html in your browser
echo    Backend API: http://localhost:3000/api
echo    Health Check: http://localhost:3000/api/health
echo.
echo 🔐 Auth token for analytics: sample-token-123
echo.
echo Happy coding! 🚀
pause 