const storeKey = (login) => `vault_privkey_${login}`

export function savePrivateKey(login, privateKeyHex) {
  localStorage.setItem(storeKey(login), privateKeyHex)
}

export function loadPrivateKey(login) {
  return localStorage.getItem(storeKey(login)) ?? null
}

export function hasPrivateKey(login) {
  return !!localStorage.getItem(storeKey(login))
}

export function removePrivateKey(login) {
  localStorage.removeItem(storeKey(login))
}
