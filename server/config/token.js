const crypto = require('crypto');

const getSecret = () => process.env.SESSION_SECRET || 'yash-tutorials-secure-production-session-key-4f46e5-312e81';

function signToken(payload, expiresInMs = 24 * 60 * 60 * 1000) {
  const secret = getSecret();
  const tokenData = {
    ...payload,
    exp: Date.now() + expiresInMs
  };
  const dataB64 = Buffer.from(JSON.stringify(tokenData)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(dataB64).digest('base64url');
  return `${dataB64}.${signature}`;
}

function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [dataB64, signature] = parts;
    const secret = getSecret();
    const expected = crypto.createHmac('sha256', secret).update(dataB64).digest('base64url');
    if (signature !== expected) return null;
    const json = JSON.parse(Buffer.from(dataB64, 'base64url').toString('utf8'));
    if (json.exp && Date.now() > json.exp) return null;
    return json;
  } catch (e) {
    return null;
  }
}

module.exports = {
  signToken,
  verifyToken
};
