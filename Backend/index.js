const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: "API working", 
    timestamp: new Date().toISOString() 
  });
});

app.get('/test', (req, res) => {
  res.json({ success: true, message: "Test endpoint working" });
});

// Simple food list endpoint
app.get('/api/food/list', async (req, res) => {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    
    // Simple food schema
    const foodSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      category: String,
      image: String
    });
    
    const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);
    
    const foods = await Food.find();
    res.json({ success: true, foods });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = app;