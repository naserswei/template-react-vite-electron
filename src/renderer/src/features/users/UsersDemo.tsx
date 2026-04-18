import { useCallback, useState } from 'react'
import type { UserDto } from '../../../../shared/types/user'

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; users: UserDto[] }
  | { status: 'error'; message: string }

/**
 * Example feature: renderer calls preload (`window.api`), which IPC-invokes main,
 * which runs Drizzle in the main process and returns JSON-safe rows.
 */
export function UsersDemo(): React.JSX.Element {
  const [state, setState] = useState<LoadState>({ status: 'idle' })

  const loadUsers = useCallback(async (): Promise<void> => {
    setState({ status: 'loading' })
    try {
      const users = await window.api.users.list()
      setState({ status: 'success', users })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setState({ status: 'error', message })
    }
  }, [])

  return (
    <section style={{ marginTop: 24, textAlign: 'left', maxWidth: 520 }}>
      <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Users (IPC + Drizzle)</h2>
      <p style={{ margin: '0 0 12px', fontSize: 13, opacity: 0.85 }}>
        Flow: <strong>renderer</strong> → <code>window.api.users.list()</code> →{' '}
        <strong>preload</strong> (<code>ipcRenderer.invoke</code>) → <strong>main</strong> (Drizzle
        query) → back to UI.
      </p>
      <button type="button" onClick={loadUsers} disabled={state.status === 'loading'}>
        {state.status === 'loading' ? 'Loading…' : 'Load users from SQLite'}
      </button>
      {state.status === 'error' ? (
        <p style={{ color: 'tomato', marginTop: 12, fontSize: 13 }}>{state.message}</p>
      ) : null}
      {state.status === 'success' ? (
        <ul style={{ marginTop: 12, paddingLeft: 18, fontSize: 14 }}>
          {state.users.length === 0 ? (
            <li>
              No rows yet. Run <code>npm run db:seed</code> after migrating.
            </li>
          ) : (
            state.users.map((u) => (
              <li key={u.id}>
                <strong>{u.name}</strong> — {u.email} (age {u.age})
              </li>
            ))
          )}
        </ul>
      ) : null}
    </section>
  )
}
