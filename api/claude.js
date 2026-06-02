// Vercel serverless function using Google's FREE Gemini API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Use v1 endpoint with gemini-pro model for AI Studio keys
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ 
        error: error.error?.message || 'API request failed' 
      });
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ response: text });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Server error: ' + error.message 
    });
  }
}
