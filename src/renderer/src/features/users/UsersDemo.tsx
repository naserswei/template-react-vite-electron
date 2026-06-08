import { useCallback, useState } from 'react'
import { AlertCircle, Database, Loader2, Mail, RefreshCw, UserRound } from 'lucide-react'
import type { UserDto } from '../../../../shared/types/user'
import { Button } from '../../components/ui/button'

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
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Database aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-normal">Users</h3>
            <p className="text-sm text-muted-foreground">Local SQLite records</p>
          </div>
        </div>
        <Button type="button" onClick={loadUsers} disabled={state.status === 'loading'}>
          {state.status === 'loading' ? (
            <Loader2 data-icon="inline-start" aria-hidden="true" className="animate-spin" />
          ) : (
            <RefreshCw data-icon="inline-start" aria-hidden="true" />
          )}
          {state.status === 'loading' ? 'Loading' : 'Load users'}
        </Button>
      </div>

      {state.status === 'error' ? (
        <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p className="min-w-0 wrap-break-word">{state.message}</p>
        </div>
      ) : null}

      {state.status === 'success' ? (
        <div className="rounded-lg border">
          {state.users.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <UserRound aria-hidden="true" />
              </div>
              <p className="text-sm font-medium">No users yet</p>
              <p className="max-w-64 text-sm text-muted-foreground">
                Seed data or insert records to populate this list.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {state.users.map((user) => (
                <li key={user.id} className="flex items-center justify-between gap-4 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
                      {user.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail aria-hidden="true" className="size-3.5 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground">
                    Age {user.age}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {state.status === 'idle' ? (
        <div className="rounded-lg border border-dashed px-4 py-8 text-center">
          <p className="text-sm font-medium">Ready to query</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Click load to read from the local app database.
          </p>
        </div>
      ) : null}
    </section>
  )
}
