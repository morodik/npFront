import { useState } from 'react'
import { StatusLog } from '../components/StatusLog.jsx'
import { useLogger } from '../lib/useLogger.js'
import { generateKeyPair, signChallenge } from '../lib/crypto.js'
import { savePrivateKey, loadPrivateKey } from '../lib/storage.js'
import { register, getChallenge, verifyLogin } from '../lib/api.js'
import styles from './AuthPage.module.css'

export function AuthPage({ onAuthenticated }) {
  const [mode, setMode]       = useState('login')   // 'login' | 'register'
  const [loginVal, setLogin]  = useState('')
  const [busy, setBusy]       = useState(false)
  const { lines, log, clear } = useLogger()

  function switchMode(m) {
    setMode(m)
    clear()
  }

  // ── Register ──────────────────────────────────────────
  async function doRegister() {
    log('Генерация ключевой пары Ed25519…', 'work')
    const { privateKeyHex, publicKeyHex } = await generateKeyPair()
    log('Ключи сгенерированы', 'ok')

    log('Отправка публичного ключа на сервер…', 'work')
    const data = await register(loginVal, publicKeyHex)

    savePrivateKey(loginVal, privateKeyHex)
    log('Приватный ключ сохранён на устройстве', 'ok')
    log('Регистрация завершена', 'ok')

    onAuthenticated({
      login: data.login ?? loginVal,
      type: 'register',
      publicKeyHex,
      challenge: null,
      signature: null,
    })
  }

  // ── Login ─────────────────────────────────────────────
  async function doLogin() {
    const privateKeyHex = loadPrivateKey(loginVal)
    if (!privateKeyHex) {
      throw new Error('Приватный ключ не найден на этом устройстве — сначала зарегистрируйтесь')
    }

    log('Запрос challenge у сервера…', 'work')
    const { challenge } = await getChallenge(loginVal)
    log('Challenge получен', 'ok')

    log('Подписание challenge приватным ключом…', 'work')
    const signature = await signChallenge(privateKeyHex, challenge)
    log('Подпись создана', 'ok')

    log('Отправка подписи на сервер…', 'work')
    const result = await verifyLogin(loginVal, signature)
    log('Сервер подтвердил подпись', 'ok')

    onAuthenticated({
      login: loginVal,
      type: 'login',
      publicKeyHex: null,
      challenge,
      signature,
      serverResponse: result,
    })
  }

  // ── Handler ───────────────────────────────────────────
  async function handleSubmit() {
    const trimmed = loginVal.trim()
    if (!trimmed) { log('Введите логин', 'warn'); return }

    clear()
    setBusy(true)

    try {
      if (mode === 'register') await doRegister()
      else                      await doLogin()
    } catch (err) {
      log(err.message, 'err')
    } finally {
      setBusy(false)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  const btnLabel = mode === 'login' ? 'Войти' : 'Зарегистрироваться'

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>

        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.brandName}>Vault</span>
          <span className={styles.brandTag}>passwordless</span>
        </div>

        {/* Mode toggle */}
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${mode === 'login' ? styles.active : ''}`}
            onClick={() => switchMode('login')}
          >
            Войти
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'register' ? styles.active : ''}`}
            onClick={() => switchMode('register')}
          >
            Регистрация
          </button>
        </div>

        {/* Field */}
        <div className={styles.fieldLabel}>Логин</div>
        <div className={styles.inputRow}>
          <span className={styles.inputPrefix}>@</span>
          <input
            className={styles.input}
            type="text"
            placeholder="username"
            autoComplete="off"
            spellCheck={false}
            value={loginVal}
            onChange={e => setLogin(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
          />
        </div>

        {/* Action button */}
        <button
          className={styles.actionBtn}
          onClick={handleSubmit}
          disabled={busy}
        >
          {busy ? <><span className={styles.spinner}>⟳</span>{btnLabel}…</> : btnLabel}
        </button>

        {/* Log */}
        <StatusLog lines={lines} />
      </div>
    </div>
  )
}
