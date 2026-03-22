/**
 * Ed25519 crypto utilities via @noble/ed25519
 *
 * Private key : 32 random bytes  → stored as hex in localStorage
 * Public key  : 32 bytes derived → sent to server as hex
 * Signature   : 64 bytes         → sent to server as hex
 */

import * as ed from '@noble/ed25519'

// Async API (getPublicKeyAsync, signAsync) works out of the box in modern browsers
// without wiring sha512 — that's only needed for the sync variants.

// ── helpers ────────────────────────────────────────

export function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function hexToBytes(hex) {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2)
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  return arr
}

// ── key generation ─────────────────────────────────

/**
 * Generate an Ed25519 key pair.
 * Returns { privateKeyHex, publicKeyHex }
 */
export async function generateKeyPair() {
  const privateKeyBytes = ed.utils.randomPrivateKey()          // 32 random bytes
  const publicKeyBytes  = await ed.getPublicKeyAsync(privateKeyBytes)

  return {
    privateKeyHex: bytesToHex(privateKeyBytes),
    publicKeyHex:  bytesToHex(publicKeyBytes),
  }
}

// ── signing ─────────────────────────────────────────

/**
 * Sign a challenge string with a hex-encoded private key.
 * Returns signature as hex string.
 */
export async function signChallenge(privateKeyHex, challenge) {
  const privBytes = hexToBytes(privateKeyHex)
  const msgBytes  = new TextEncoder().encode(challenge)
  const sigBytes  = await ed.signAsync(msgBytes, privBytes)
  return bytesToHex(sigBytes)
}
