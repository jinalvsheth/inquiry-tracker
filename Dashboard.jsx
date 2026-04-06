/**
 * Dashboard.jsx
 * Drop your existing App.jsx UI here.
 * Replace the local `entries` state with the Supabase hooks below.
 */
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export default function Dashboard({ session, profile }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  // ── Fetch all inquiries ──────────────────────────────────────────────────
  const fetchEntries = useCallback(async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setEntries(data)
    setLoading(false)
  }, [])

  // ── Realtime subscription (live updates for all team members) ───────────
  useEffect(() => {
    fetchEntries()

    const channel = supabase
      .channel('inquiries-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
        fetchEntries()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchEntries])

  // ── Add new inquiry ──────────────────────────────────────────────────────
  async function addEntry(form) {
    const { error } = await supabase.from('inquiries').insert({
      ...form,
      created_by: session.user.id,
    })
    if (error) alert('Error saving: ' + error.message)
    // realtime will refresh the list automatically
  }

  // ── Advance stage ────────────────────────────────────────────────────────
  const STAGE_ORDER = ['inquiry','sample','quote','order','production']

  async function advanceStage(id) {
    const entry = entries.find(e => e.id === id)
    if (!entry) return
    const idx  = STAGE_ORDER.indexOf(entry.stage)
    const next = STAGE_ORDER[idx + 1]
    if (!next) return
    const { error } = await supabase.from('inquiries').update({ stage: next }).eq('id', id)
    if (error) alert('Update failed: ' + error.message)
  }

  // ── Sign out ─────────────────────────────────────────────────────────────
  async function signOut() {
    await supabase.auth.signOut()
  }

  // ── Role from real profile ───────────────────────────────────────────────
  const role = profile?.role || 'sales'

  if (loading) return <div style={{ padding: 40, color: '#888' }}>Loading data...</div>

  /**
   * PASTE YOUR EXISTING UI HERE
   * ─────────────────────────────
   * Replace:
   *   const [entries, setEntries] = useState(SEED)   →  remove (managed above)
   *   handleSubmit()                                  →  call addEntry(form)
   *   advanceStage()                                  →  use advanceStage() above
   *   const role = ...toggle state...                 →  use role from profile
   *
   * Add a sign-out button somewhere:
   *   <button onClick={signOut}>Sign out</button>
   *
   * Show the logged-in user:
   *   session.user.email
   */

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <strong>TrackFlow</strong>
          <span style={{ marginLeft: 12, fontSize: 13, color: '#888' }}>
            Signed in as {session.user.email} ({role})
          </span>
        </div>
        <button onClick={signOut} style={{ fontSize: 13, padding: '6px 14px', border: '0.5px solid #ccc', borderRadius: 7, cursor: 'pointer', background: 'transparent' }}>
          Sign out
        </button>
      </div>

      {/* ── YOUR EXISTING PIPELINE/ANALYTICS JSX GOES HERE ── */}
      <p style={{ color: '#888', fontSize: 14 }}>
        Paste your pipeline UI here. Pass <code>entries</code>, <code>addEntry</code>,{' '}
        <code>advanceStage</code>, and <code>role</code> as props or inline.
      </p>

      <pre style={{ fontSize: 12, background: '#f5f5f3', padding: 16, borderRadius: 8 }}>
        {JSON.stringify(entries.slice(0, 2), null, 2)}
      </pre>
    </div>
  )
}