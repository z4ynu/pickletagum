import crypto from 'node:crypto';

function cookieValue(header, name) {
  return (header || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

function validState(state, cookie, secret) {
  if (!state || !cookie || !secret) return false;
  const [storedState, signature] = cookie.split('.');
  const expected = crypto.createHmac('sha256', secret).update(state).digest('hex');
  return storedState === state && signature?.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function resultPage(status, content) {
  const payload = JSON.stringify(content).replace(/</g, '\\u003c');
  return `<!doctype html><html><body><script>
    window.addEventListener('message', function receiveMessage(event) {
      window.opener.postMessage('authorization:github:${status}:${payload}', event.origin);
      window.removeEventListener('message', receiveMessage, false);
      window.close();
    }, false);
    window.opener.postMessage('authorizing:github', '*');
  </script></body></html>`;
}

export default async function handler(req, res) {
  const { code, state, error } = req.query;
  const { CMS_GITHUB_CLIENT_ID, CMS_GITHUB_CLIENT_SECRET, CMS_OAUTH_SECRET } = process.env;
  const cookie = cookieValue(req.headers.cookie, 'cms_oauth_state');
  res.setHeader('Set-Cookie', 'cms_oauth_state=; HttpOnly; SameSite=Lax; Path=/api/cms-auth; Max-Age=0');

  if (error || !validState(state, cookie, CMS_OAUTH_SECRET)) {
    res.status(400).setHeader('Content-Type', 'text/html; charset=utf-8').send(resultPage('error', { error: error || 'Invalid OAuth state.' }));
    return;
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CMS_GITHUB_CLIENT_ID, client_secret: CMS_GITHUB_CLIENT_SECRET, code }),
  });
  const token = await tokenResponse.json();
  if (!tokenResponse.ok || !token.access_token) {
    res.status(502).setHeader('Content-Type', 'text/html; charset=utf-8').send(resultPage('error', { error: token.error_description || 'GitHub token exchange failed.' }));
    return;
  }

  res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(resultPage('success', { token: token.access_token, provider: 'github' }));
}
