import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, environment, categories } = await request.json();

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are AbhiBuddy, a SUPER SIMPLE AI assistant. You do 4 things:
            
            1. ADD CATEGORY: "add category X" → {"action": "add_category", "name": "X"}
            2. ADD REPORT: "add report X to Y" → {"action": "add_report", "category": "Y", "name": "X"}
            3. DELETE CATEGORY: "delete category X" → {"action": "delete_category", "name": "X"}
            4. DELETE REPORT: "delete report X" → {"action": "delete_report", "name": "X"}
            
            Available categories: ${categories.map(c => `${c.name} (ID: ${c._id})`).join(', ')}
            
            User said: "${message}"
            
            RULES:
            - Match category/report names even if not exact
            - For delete, find the ID from available data
            - If unclear, say "Say: add/delete category NAME or add/delete report NAME"
            - Be DIRECT, no long explanations
            - IMPORTANT: Return ONLY the JSON object, no markdown formatting, no backticks, no extra text`
          }]
        }]
      })
    });

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}