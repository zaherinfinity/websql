import { useState, useEffect } from 'react'

function App() {
  const [mode, setMode] = useState('login') // login, register, dashboard
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sessionUser, setSessionUser] = useState(null)

  // SQL state
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM employees;')
  const [sqlResults, setSqlResults] = useState(null)
  const [sqlError, setSqlError] = useState('')

  // Check session on load
  useEffect(() => {
    fetch('/api?action=check', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.isLoggedIn) {
          setSessionUser(data.username)
          setMode('dashboard')
        }
      })
  }, [])

  // Auto-setup database (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      fetch('/api?action=setup', { method: 'POST', credentials: 'include' })
        .catch(console.error)
    }
  }, [])

  async function handleAuth(action) {
    setError('')
    const res = await fetch(`/api?action=${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      if (action === 'login') {
        setSessionUser(username)
        setMode('dashboard')
      } else {
        setMode('login')
        setError('Registration successful! Please log in.')
      }
      setPassword('')
    }
  }

  async function handleLogout() {
    await fetch('/api?action=logout', { method: 'POST', credentials: 'include' })
    setSessionUser(null)
    setMode('login')
    setSqlResults(null)
    setSqlError('')
  }

  async function runSql() {
    setSqlError('')
    setSqlResults(null)
    const res = await fetch('/api?action=sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ query: sqlQuery })
    })
    const data = await res.json()
    if (data.error) {
      setSqlError(data.error)
    } else {
      setSqlResults(data.rows)
    }
  }

  if (mode === 'login' || mode === 'register') {
    const isLogin = mode === 'login'
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-center text-slate-800 mb-6">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          {error && (
            <div className={`mb-4 px-4 py-2 rounded-lg ${error.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            onClick={() => handleAuth(isLogin ? 'login' : 'register')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {isLogin ? 'Sign In' : 'Register'}
          </button>
          <p className="text-center text-slate-600 mt-4">
            {isLogin ? 'No account?' : 'Already have an account?'}{' '}
            <button onClick={() => { setMode(isLogin ? 'register' : 'login'); setError('') }} className="text-blue-600 hover:underline">
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">SQL Live Console</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Hello, {sessionUser}</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">SQL Live Editor</h2>
            <textarea
              value={sqlQuery}
              onChange={e => setSqlQuery(e.target.value)}
              rows={6}
              className="w-full font-mono text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={runSql} className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition">
              ▶ Execute Query
            </button>
            <div className="mt-4 text-sm text-slate-500">
              <p className="font-semibold">📘 Sample queries:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li><code className="bg-slate-100 px-1 rounded">SELECT * FROM employees;</code></li>
                <li><code className="bg-slate-100 px-1 rounded">SELECT name, salary FROM employees WHERE salary &gt; 70000;</code></li>
                <li><code className="bg-slate-100 px-1 rounded">SELECT department, AVG(salary) FROM employees GROUP BY department;</code></li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            {sqlError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
                {sqlError}
              </div>
            )}
            {sqlResults && (
              <div className="overflow-x-auto">
                {sqlResults.length === 0 ? (
                  <p className="text-slate-500">No rows returned.</p>
                ) : (
                  <table className="min-w-full border border-slate-200 text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        {Object.keys(sqlResults[0]).map(col => (
                          <th key={col} className="border px-3 py-2 text-left font-semibold">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlResults.map((row, i) => (
                        <tr key={i} className="even:bg-slate-50">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="border px-3 py-2">{val === null ? 'NULL' : String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
