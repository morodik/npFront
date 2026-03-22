import styles from './StatusLog.module.css'

const ICONS = {
  info: '·',
  ok:   '✓',
  err:  '✗',
  warn: '!',
  work: '›',
}

export function StatusLog({ lines }) {
  if (!lines.length) return null

  return (
    <div className={styles.log}>
      {lines.map(({ id, text, type }) => (
        <div key={id} className={`${styles.line} ${styles[type]}`}>
          <span className={styles.prefix}>{ICONS[type] ?? '·'}</span>
          <span className={styles.text}>{text}</span>
        </div>
      ))}
    </div>
  )
}
