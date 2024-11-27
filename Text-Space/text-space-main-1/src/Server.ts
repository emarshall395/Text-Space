import * as dotenv from 'dotenv';
import express from 'express';
import connectDB from './dbConnect';
import { App } from './App'; // Import your App class
 
dotenv.config();
 
// Initialize Express app
const serverApp = express();
const PORT = process.env.PORT || 5000;
 
// Connect to MongoDB
connectDB();
 
// Initialize the App instance to configure routes
const appInstance = new App();
 
// Middleware for JSON parsing
serverApp.use(express.json());
 
// Root route for welcome message
serverApp.get('/', (req, res) => {
  res.send('Welcome to the Messages API! Use /api/messages to interact with the endpoints.');
});
 
// Use the expressApp from App class (which has all the routes configured)
serverApp.use(appInstance.expressApp);
 
// Start the server
serverApp.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});