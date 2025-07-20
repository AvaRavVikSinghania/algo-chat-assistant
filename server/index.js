require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 👇 Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, '..', 'client')));

const MODEL = 'gemini-2.5-flash';
const API_KEY = process.env.API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// ✅ POST endpoint to handle chat
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const systemInstruction = 'You are a Code AI Mentor. Your purpose is to assist users with their coding questions, providing clear explanations and code examples where appropriate. Be encouraging and helpful.';

  try {
    const response = await axios.post(API_URL, {
      contents: [{
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\n${userMessage}` }]
      }]
    });

    const botMessage = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
    res.json({ reply: botMessage });

  } catch (error) {
    console.error('Gemini Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'AI response failed' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
