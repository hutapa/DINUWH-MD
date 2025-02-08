// Required modules
const express = require('express');
const axios = require('axios');

// Initialize express app
const app = express();
const port = 3000;  // Port set කිරීම

// Endpoint to generate AI image
app.get('/aiimg', async (req, res) => {
  try {
    // Get the prompt from the query params
    const { prompt } = req.query;

    // Check if prompt is provided
    if (!prompt) {
      return res.send('Error: No prompt provided. Please add a prompt.');
    }

    // Stable Diffusion API URL (API service for AI image generation)
    const apiUrl = `https://api.thenux.dev/stablediffusion?prompt=${encodeURIComponent(prompt)}`;

    // Request to the API for image generation
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 });

    // Handle if no response data is found
    if (!response.data) {
      return res.send('Error: Unable to generate the AI image.');
    }

    // Send back the generated image
    res.set('Content-Type', 'image/jpeg');
    res.send(response.data);  // Send the image data directly in response

  } catch (error) {
    console.error("AI Image Generation Error:", error);
    res.send('Error: Something went wrong during image generation.');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
