import { useState } from 'react'
import { AuthPage }   from './pages/AuthPage.jsx'
import { Dashboard }  from './pages/Dashboard.jsx'

export default function App() {
  const [session, setSession] = useState(null)   // null = not authenticated

  function handleAuthenticated(sessionData) {
    setSession(sessionData)
  }

  function handleSignOut() {
    setSession(null)
  }

  if (!session) {
    return <AuthPage onAuthenticated={handleAuthenticated} />
  }

  return <Dashboard session={session} onSignOut={handleSignOut} />
}
