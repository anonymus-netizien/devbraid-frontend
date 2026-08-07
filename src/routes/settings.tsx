import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/devbraid/states'
import { SectionLabel } from '@/components/devbraid/chips'
import { useAuth } from '@/context/AuthContext'
import authService from '@/services/auth.service'
import { detectTimezone, getTimezone, setTimezone } from '@/lib/time'
import { RefreshCw, Save, Moon, Bell, Globe } from 'lucide-react'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [tz, setTz] = useState(getTimezone)
  const [detectedTz] = useState(detectTimezone)

  // AuthProvider bootstraps the user asynchronously — sync the field once it loads.
  useEffect(() => {
    if (user?.fullName) setDisplayName(user.fullName)
  }, [user?.fullName])

  const handleSaveProfile = async () => {
    if (!displayName.trim()) return
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    try {
      await authService.updateProfile({ fullName: displayName.trim() })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save profile'
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageHeader
        eyebrow="Platform"
        title="Settings"
        description="Configure your DevBraid workspace."
      />
      <div className="space-y-8 max-w-2xl">
        {/* Profile Section */}
        <section className="rounded-xl bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3">
            <Save className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium text-foreground">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="block text-xs font-medium text-muted-foreground mb-1.5"
              >
                Display name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-foreground text-sm placeholder:text-muted-foreground"
                placeholder="Your display name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-muted-foreground mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue={user?.email || ''}
                disabled
                className="input w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-foreground text-sm opacity-60 cursor-not-allowed"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed.</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving || !displayName.trim()}
                className="btn btn-primary btn-md"
              >
                {saving && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <Save className="h-3.5 w-3.5" />
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              {saved && <span className="text-xs text-success-fg">Saved!</span>}
              {saveError && <span className="text-xs text-danger-fg">{saveError}</span>}
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="rounded-xl bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3">
            <Bell className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium text-foreground">Notifications</h2>
          </div>
          <label className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground">Email notifications</p>
              <p className="text-[10px] text-muted-foreground">
                Get notified when briefs are generated
              </p>
            </div>
            <input type="checkbox" className="toggle toggle-sm" defaultChecked />
          </label>
        </section>

        {/* Appearance Section */}
        <section className="rounded-xl bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3">
            <Moon className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium text-foreground">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground">Theme</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-success-bg text-success-fg">
              Dark
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            DevBraid is dark-only — obsidian canvas, bronze accents. One theme to design, build, and
            maintain.
          </p>
        </section>

        {/* Timezone Section */}
        <section className="rounded-xl bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3">
            <Globe className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium text-foreground">Timezone</h2>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="timezone" className="sr-only">
              Timezone
            </label>
            <select
              id="timezone"
              value={tz}
              onChange={(e) => {
                setTz(e.target.value)
                setTimezone(e.target.value)
              }}
              className="select w-full max-w-sm rounded-lg border border-hairline bg-surface-2 px-3 py-2 text-sm text-foreground"
            >
              <option value={detectedTz}>Auto ({detectedTz})</option>
              <option value="UTC">UTC</option>
              <option value="Europe/Amsterdam">Europe/Amsterdam</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
            <span className="text-[10px] text-muted-foreground">For decision-note timestamps</span>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-danger-border bg-danger-bg p-5 space-y-4">
          <SectionLabel>Danger zone</SectionLabel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-danger">Delete workspace</p>
              <p className="mt-1 text-xs text-danger">
                Removes all change threads, decision notes and briefs. Cannot be undone.
              </p>
            </div>
            <span className="inline-flex items-center rounded-md border border-danger-border bg-danger-bg px-3 py-1.5 text-xs font-medium text-danger cursor-not-allowed opacity-70">
              Coming soon
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
