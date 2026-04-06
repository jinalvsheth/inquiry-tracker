import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode]         = useState('login')   // 'login' | 'signup'
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [msg, setMsg]           = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setMsg(''); setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMsg('Check your email to confirm your account.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f3', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: 12, padding: '36px 40px', width: 360 }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#111' }}>TrackFlow</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Inquiry → Order Tracker</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 5 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={inputStyle} placeholder="you@company.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 5 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={inputStyle} placeholder="••••••••" />
          </div>

          {error && <div style={{ fontSize: 12, color: '#c0392b', marginBottom: 12, padding: '8px 10px', background: '#fdf0ee', borderRadius: 6 }}>{error}</div>}
          {msg   && <div style={{ fontSize: 12, color: '#1D9E75', marginBottom: 12, padding: '8px 10px', background: '#eaf7f2', borderRadius: 6 }}>{msg}</div>}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#378ADD', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: '#888' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMsg('') }}
            style={{ color: '#378ADD', cursor: 'pointer', fontWeight: 500 }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '9px 12px',
  border: '0.5px solid #ccc', borderRadius: 7, fontSize: 13,
  outline: 'none', fontFamily: 'sans-serif'
}