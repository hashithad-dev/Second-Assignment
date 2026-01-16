import { LoginForm } from "./components/login-form"
import { Dashboard } from "./components/Dashboard"
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useState, useEffect } from 'react'

function App() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      return
    }

    const params = new URLSearchParams(window.location.search)
    const githubUser = params.get('github_user')
    const errorParam = params.get('error')
    
    if (errorParam) {
      setError('Authentication failed. Please try again.')
      window.history.replaceState({}, '', '/')
    } else if (githubUser) {
      const userData = JSON.parse(githubUser)
      const user = {
        name: userData.name || userData.login,
        email: userData.email,
        picture: userData.avatar_url,
      }
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('auth_token')
    document.cookie = 'google_token=; max-age=0; path=/'
    document.cookie = 'github_token=; max-age=0; path=/'
    setUser(null)
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <LoginForm onLoginSuccess={setUser} error={error} onErrorClear={() => setError('')} />
        </div>
      )}
    </GoogleOAuthProvider>
  )
}

export default App
