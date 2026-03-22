import styles from './Dashboard.module.css'

function trunc(str, n = 56) {
  if (!str) return '—'
  return str.length > n ? str.slice(0, n) + '…' : str
}

export function Dashboard({ session, onSignOut }) {
  const now     = new Date()
  const timeStr = now.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = now.toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })

  const isRegister = session.type === 'register'

  return (
    <div className={styles.page}>

      {/* Top bar */}
      <div className={styles.topbar}>
        <span className={styles.topbarBrand}>Vault</span>
        <div className={styles.topbarRight}>
          <span className={styles.topbarLogin}>{session.login}</span>
          <button className={styles.signoutBtn} onClick={onSignOut}>Выйти</button>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>

        <div className={styles.sessionBanner}>
          <div className={styles.dot} />
          Сессия активна
        </div>

        <div className={styles.heading}>
          Добро пожаловать, <strong>{session.login}</strong>
        </div>
        <div className={styles.subtext}>
          {isRegister
            ? 'Аккаунт создан · ключевая пара Ed25519 сгенерирована и сохранена'
            : 'Вход выполнен через криптографическую подпись Ed25519'}
        </div>

        {/* Session info */}
        <InfoBlock title="Сессия">
          <InfoRow k="Логин"    v={session.login}            vClass="hi" />
          <InfoRow k="Тип"      v={isRegister ? 'Новый аккаунт' : 'Существующий аккаунт'} />
          <InfoRow k="Метод"    v="passwordless / Ed25519" />
          <InfoRow k="Статус"   v="● authenticated"          vClass="ok" />
          <InfoRow k="Время"    v={`${timeStr} · ${dateStr}`} />
        </InfoBlock>

        {/* Crypto info */}
        <InfoBlock title="Криптография">
          <InfoRow k="Алгоритм"       v="Ed25519 (Edwards-curve DSA)" />
          <InfoRow k="Ключ"           v="32 байта · детерминированный" />
          <InfoRow k="Подпись"        v="64 байта" />
          <InfoRow k="Приватный ключ" v="сохранён на устройстве (localStorage)" vClass="ok" />
          {session.publicKeyHex && (
            <InfoRow k="Публичный ключ" v={trunc(session.publicKeyHex, 48)} vClass="mono" />
          )}
        </InfoBlock>

        {/* Challenge exchange (login only) */}
        {!isRegister && (
          <InfoBlock title="Последний обмен">
            <InfoRow k="Challenge" v={trunc(session.challenge, 56)} vClass="mono" />
            <InfoRow k="Подпись"   v={trunc(session.signature, 56)} vClass="mono" />
          </InfoBlock>
        )}
      </div>

      <footer className={styles.footer}>
        Ed25519 · @noble/ed25519 · приватный ключ хранится в localStorage
      </footer>
    </div>
  )
}

function InfoBlock({ title, children }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div className={styles.blockTitle}>{title}</div>
      {children}
    </div>
  )
}

function InfoRow({ k, v, vClass }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoKey}>{k}</span>
      <span className={`${styles.infoVal} ${vClass ? styles[vClass] : ''}`}>{v}</span>
    </div>
  )
}
