const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const visitors = new Map();

function getClientIp(request) {
  return request.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = visitors.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now >= entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }
  entry.count += 1;
  visitors.set(ip, entry);
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-6).flatMap((item) => {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string') return [];
    return [{ role: item.role, content: item.content.slice(0, 1000) }];
  });
}

async function loadCourts() {
  const url = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  const response = await fetch(`${url}/rest/v1/courts?select=name,area,types,link,facebook_link,booking_method,note,is_coming_soon&order=name`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) return [];
  return response.json();
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });
  if (isRateLimited(getClientIp(request))) return response.status(429).json({ error: 'Please wait a minute before asking again.' });

  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : '';
  if (!message || message.length > 1000) return response.status(400).json({ error: 'Please enter a question of up to 1,000 characters.' });
  if (!process.env.GEMINI_API_KEY) return response.status(503).json({ error: 'The availability assistant is not configured yet. Please use the court’s official page for now.' });

  try {
    const courts = await loadCourts();
    const conversation = [...cleanHistory(request.body?.history), { role: 'user', content: message }]
      .map((item) => `${item.role === 'assistant' ? 'Assistant' : 'User'}: ${item.content}`)
      .join('\n');
    const modelResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GEMINI_AVAILABILITY_MODEL || 'gemini-3.1-flash-lite',
        tools: [{ type: 'google_search' }],
        input: `You are TagumPickle's availability assistant. Reply in the user's language (Bisaya, Tagalog, English, or mixed). You help people find pickleball courts in Tagum City only. You may use Google Search to inspect public information, but never log in, bypass a paywall, attempt a booking, submit a form, send a message, or handle payments. Treat booking availability as time-sensitive: do not state that a court is available unless a public source explicitly supports it for the requested date and time. If it cannot be verified, say so clearly and direct the user to the official booking/contact link. Never invent schedules, prices, availability, court details, or sources. Keep the answer concise and include the court's official link when one is in the directory. End any availability answer with a brief reminder to confirm directly with the venue. Current directory data: ${JSON.stringify(courts)}\n\nConversation:\n${conversation}`,
      }),
    });
    const data = await modelResponse.json();
    if (!modelResponse.ok) {
      const error = new Error(data?.error?.message || 'Gemini request failed');
      error.status = modelResponse.status;
      error.type = data?.error?.type;
      throw error;
    }
    const outputBlocks = (data.steps || [])
      .filter((step) => step.type === 'model_output')
      .flatMap((step) => step.content || [])
      .filter((block) => block.type === 'text');
    const answer = String(data.output_text || outputBlocks.map((block) => block.text || '').join('\n') || '').trim();
    if (!answer) throw new Error('The assistant returned no answer');
    return response.status(200).json({ answer });
  } catch (error) {
    console.error('Availability assistant error:', { status: error.status, type: error.type, message: error.message });
    if (error.status === 401 || error.status === 403) return response.status(502).json({ error: 'Gemini rejected the API key. Check the GEMINI_API_KEY value in Vercel, then redeploy.' });
    if (error.status === 429) return response.status(502).json({ error: 'Gemini has reached its free-tier limit. Please try again later.' });
    if (error.status === 404) return response.status(502).json({ error: 'The configured Gemini model is unavailable to this API project. Try gemini-3.1-flash-lite or check your project access.' });
    if (error.status === 400) return response.status(502).json({ error: 'Gemini could not accept this availability request. Check the model setting and your API project configuration.' });
    return response.status(502).json({ error: 'Could not check availability right now. Please try again or use the court’s official page.' });
  }
}
