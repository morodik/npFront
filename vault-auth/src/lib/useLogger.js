import { useState, useCallback } from 'react'

/**
 * useLogger — manages an array of log lines for the auth status UI.
 *
 * Returns { lines, log, clear }
 * log(text, type) — type: 'info' | 'ok' | 'err' | 'warn' | 'work'
 */
export function useLogger() {
  const [lines, setLines] = useState([])

  const log = useCallback((text, type = 'info') => {
    setLines(prev => [...prev, { text, type, id: Date.now() + Math.random() }])
  }, [])

  const clear = useCallback(() => setLines([]), [])

  return { lines, log, clear }
}
