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
  if (!process.env.OPENAI_API_KEY) return response.status(503).json({ error: 'The availability assistant is not configured yet. Please use the court’s official page for now.' });

  try {
    const courts = await loadCourts();
    const modelResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_AVAILABILITY_MODEL || 'gpt-5.6-luna',
        tools: [{ type: 'web_search' }],
        instructions: `You are TagumPickle's availability assistant. Reply in the user's language (Bisaya, Tagalog, English, or mixed). You help people find pickleball courts in Tagum City only. You may use web search to inspect public information, but never log in, bypass a paywall, attempt a booking, submit a form, send a message, or handle payments. Treat booking availability as time-sensitive: do not state that a court is available unless a public source explicitly supports it for the requested date and time. If it cannot be verified, say so clearly and direct the user to the official booking/contact link. Never invent schedules, prices, availability, court details, or sources. Keep the answer concise and include the court's official link when one is in the directory. End any availability answer with a brief reminder to confirm directly with the venue. Current directory data: ${JSON.stringify(courts)}`,
        input: [...cleanHistory(request.body?.history), { role: 'user', content: message }],
      }),
    });
    const data = await modelResponse.json();
    if (!modelResponse.ok) throw new Error(data?.error?.message || 'OpenAI request failed');
    const answer = String(data.output_text || '').trim();
    if (!answer) throw new Error('The assistant returned no answer');
    return response.status(200).json({ answer });
  } catch (error) {
    console.error('Availability assistant error:', error);
    return response.status(502).json({ error: 'Could not check availability right now. Please try again or use the court’s official page.' });
  }
}
