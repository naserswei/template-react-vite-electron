import Versions from './components/Versions'
import { UsersDemo } from './features/users/UsersDemo'
import { Button } from './components/ui/button'
import {
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  Database,
  Download,
  Github,
  MonitorCog,
  RefreshCw,
  ShieldCheck,
  Sparkles
} from 'lucide-react'

const stackItems = [
  { label: 'Electron', value: 'Desktop shell', icon: MonitorCog },
  { label: 'React', value: 'Renderer UI', icon: Blocks },
  { label: 'SQLite', value: 'Local data', icon: Database },
  { label: 'Updates', value: 'GitHub releases', icon: RefreshCw }
]

const releaseChecks = [
  'macOS bundle launches',
  'Windows updater verified',
  'Drizzle migrations run on startup'
]

function App(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Template workspace</p>
              <h1 className="text-2xl font-semibold tracking-normal">React Vite Electron</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" asChild>
              <a
                href="https://github.com/naserswei/template-react-vite-electron"
                target="_blank"
                rel="noreferrer"
              >
                <Github data-icon="inline-start" aria-hidden="true" />
                Source
              </a>
            </Button>
            <div className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground">
              Version 1.0.12
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <div className="flex w-fit items-center gap-2 rounded-md border bg-muted px-2.5 py-1 text-sm text-muted-foreground">
                  <ShieldCheck aria-hidden="true" className="size-4" />
                  Release channel ready
                </div>
                <div className="max-w-2xl">
                  <h2 className="text-4xl font-semibold tracking-normal">A practical Electron starter</h2>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    Built around a typed main process, IPC boundaries, local SQLite storage, and
                    release artifacts for macOS and Windows.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stackItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <div key={item.label} className="rounded-lg border bg-background p-3">
                      <Icon aria-hidden="true" className="mb-3 size-5 text-muted-foreground" />
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <aside className="rounded-lg border bg-card p-5 text-card-foreground">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-normal">Release Health</h2>
                <p className="text-sm text-muted-foreground">Latest checks</p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <BadgeCheck aria-hidden="true" />
              </div>
            </div>
            <ul className="mt-5 flex flex-col gap-3">
              {releaseChecks.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="size-2 rounded-full bg-chart-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-normal">Local Data</h2>
                <p className="text-sm text-muted-foreground">SQLite through main-process IPC</p>
              </div>
              <Database aria-hidden="true" className="size-5 text-muted-foreground" />
            </div>
            <UsersDemo />
          </div>

          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-normal">Runtime</h2>
                <p className="text-sm text-muted-foreground">Packaged app environment</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/naserswei/template-react-vite-electron/releases"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download data-icon="inline-start" aria-hidden="true" />
                  Releases
                  <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                </a>
              </Button>
            </div>
            <Versions />
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
