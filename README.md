# 🚀 Interactive Dashboard - Frontend & Backend

A complete web application with a beautiful frontend interface and a fully functional Node.js backend API. Every button is functional with proper error handling, loading states, and visual feedback.

## ✨ Features

### Frontend
- 🎨 **Modern UI Design** - Beautiful gradient design with smooth animations
- 🔄 **Loading States** - Visual feedback during API calls
- ✅ **Success/Error Feedback** - Color-coded button states and notifications
- 📱 **Responsive Design** - Works on all device sizes
- 🎯 **Interactive Elements** - Hover effects and smooth transitions
- 📊 **Real-time Results** - Live display of API responses

### Backend
- 🔌 **RESTful API** - Complete CRUD operations
- 🔒 **Authentication** - Token-based auth for protected routes
- 🌐 **CORS Enabled** - Cross-origin requests supported
- 📝 **Comprehensive Routes** - Users, Posts, Search, Analytics
- ⚡ **Error Handling** - Proper HTTP status codes and error messages
- 📈 **Sample Data** - Pre-populated with realistic data

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Verify server is running:**
   - Server will start on `http://localhost:3000`
   - Health check: `http://localhost:3000/api/health`
   - You should see the server startup message with all available endpoints

### Frontend Setup

1. **Open the HTML file:**
   - Navigate to the `frontend` folder
   - Open `index.html` in your browser
   - Or serve it using a local server:
     ```bash
     # Using Python 3
     python -m http.server 8080
     
     # Using Node.js (if you have http-server installed)
     npx http-server -p 8080
     
     # Using PHP
     php -S localhost:8080
     ```

2. **Access the application:**
   - Open `http://localhost:8080` in your browser
   - The dashboard should load with all buttons ready to use

## 🎯 Available API Endpoints

### Public Endpoints
- `GET /api/health` - Server health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/search?q=query` - Search items

### Protected Endpoints
- `GET /api/analytics` - Get analytics data (requires auth token)

**Auth Token:** `sample-token-123`

## 🎮 How to Use

### 1. Get User Data
- Click the "Get User Data" button
- Fetches user information from the server
- Displays user details in the results section

### 2. Create Post
- Click the "Create Post" button
- Sends a POST request with sample data
- Creates a new post and shows confirmation

### 3. Get Posts
- Click the "Get Posts" button
- Retrieves all posts from the server
- Displays the list of posts

### 4. Search Items
- Click the "Search Items" button
- Searches for items with "sample" query
- Shows search results with filtering

### 5. Get Analytics
- Click the "Get Analytics" button
- Requires authentication token
- Displays comprehensive analytics data

### 6. Test Error Handling
- Click the "Test Error" button
- Intentionally requests a non-existent endpoint
- Demonstrates error handling and user feedback

## 🔧 Configuration

### Frontend Configuration
The frontend is configured to connect to the backend at `http://localhost:3000`. If you change the backend port, update this line in `frontend/index.html`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Backend Configuration
The backend runs on port 3000 by default. You can change this by:

1. Setting an environment variable:
   ```bash
   PORT=4000 npm start
   ```

2. Or modifying the server.js file:
   ```javascript
   const PORT = process.env.PORT || 4000;
   ```

## 🎨 Customization

### Adding New Buttons
1. Add a new button card in the HTML:
   ```html
   <div class="button-card">
       <h3>Your Button Title</h3>
       <p>Description of what the button does.</p>
       <button class="btn" onclick="yourFunction()" id="yourBtnId">
           <span class="btn-text">Your Button Text</span>
       </button>
   </div>
   ```

2. Add the corresponding JavaScript function:
   ```javascript
   async function yourFunction() {
       const buttonId = 'yourBtnId';
       setButtonLoading(buttonId, true);
       
       try {
           const response = await fetch(`${API_BASE_URL}/your-endpoint`);
           const data = await response.json();
           addResult('Your Result Title', data, 'success');
           setButtonSuccess(buttonId);
       } catch (error) {
           addResult('Error Title', { error: error.message }, 'error');
           setButtonError(buttonId);
       } finally {
           setButtonLoading(buttonId, false);
       }
   }
   ```

### Adding New API Endpoints
1. Add a new route in `backend/server.js`:
   ```javascript
   app.get('/api/your-endpoint', (req, res) => {
       try {
           // Your logic here
           res.json({
               success: true,
               data: yourData,
               message: 'Success message'
           });
       } catch (error) {
           res.status(500).json({
               success: false,
               error: 'Error message',
               message: error.message
           });
       }
   });
   ```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure the backend is running on port 3000
   - Check that CORS is properly configured in server.js
   - Verify the frontend is accessing the correct URL

2. **Buttons Not Working**
   - Check browser console for JavaScript errors
   - Ensure the backend server is running
   - Verify network connectivity

3. **Port Already in Use**
   - Change the port in server.js or use a different port
   - Kill any existing processes using the port

4. **Authentication Errors**
   - Use the correct auth token: `sample-token-123`
   - Ensure the Authorization header is properly formatted

### Debug Commands

```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Test a specific endpoint
curl http://localhost:3000/api/users

# Test with authentication
curl -H "Authorization: Bearer sample-token-123" http://localhost:3000/api/analytics
```

## 📁 Project Structure

```
├── frontend/
│   └── index.html          # Main frontend file
├── backend/
│   ├── server.js           # Express server
│   └── package.json        # Backend dependencies
└── README.md              # This file
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use a process manager like PM2
3. Configure your web server (nginx, Apache)
4. Set up SSL certificates

### Frontend Deployment
1. Upload the HTML file to your web server
2. Update the API_BASE_URL to point to your production backend
3. Configure CORS on the backend for your domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the browser console for errors
3. Verify all setup steps were followed
4. Create an issue with detailed error information

---

**Happy Coding! 🎉**
