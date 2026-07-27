import crypto from 'node:crypto';

function getOrigin(req) {
  if (process.env.CMS_SITE_URL) return new URL(process.env.CMS_SITE_URL).origin;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  return `${protocol}://${req.headers.host}`;
}

function sign(value) {
  return crypto.createHmac('sha256', process.env.CMS_OAUTH_SECRET).update(value).digest('hex');
}

export default function handler(req, res) {
  const { CMS_GITHUB_CLIENT_ID, CMS_OAUTH_SECRET } = process.env;
  if (!CMS_GITHUB_CLIENT_ID || !CMS_OAUTH_SECRET) {
    res.status(500).send('CMS authentication is not configured.');
    return;
  }

  const state = crypto.randomBytes(24).toString('hex');
  const signedState = `${state}.${sign(state)}`;
  const secure = process.env.VERCEL ? '; Secure' : '';
  res.setHeader('Set-Cookie', `cms_oauth_state=${signedState}; HttpOnly; SameSite=Lax; Path=/api/cms-auth; Max-Age=600${secure}`);

  const origin = getOrigin(req);
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.search = new URLSearchParams({
    client_id: CMS_GITHUB_CLIENT_ID,
    redirect_uri: `${origin}/api/cms-auth/callback`,
    scope: 'repo',
    state,
  }).toString();
  res.redirect(302, authorizeUrl.toString());
}
