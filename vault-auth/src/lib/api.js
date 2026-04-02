const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

async function request(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(BASE + path, opts)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `HTTP ${res.status}`)
  }

  return res.json()
}

/**
 * Step 1 of registration.
 * POST /auth/register { login, publicKey }
 * Server responds { login }
 */
export async function register(login, publicKey) {
  return request('/auth/register', 'POST', { login, publicKey })
}

/**
 * Step 1 of login — request a challenge.
 * POST /auth/challenge { login }
 * Server responds { challenge }
 */
export async function getChallenge(login) {
  return request('/auth/challenge', 'POST', { login })
}

/**
 * Step 2 of login — submit signed challenge.
 * POST /auth/login { login, signature }
 * Server responds with session data (token, etc.)
 */
export async function verifyLogin(login, signature) {
  return request('/auth/login', 'POST', { login, signature })
}
