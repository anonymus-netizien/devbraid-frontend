import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PageHeader } from '@/components/devbraid/states'
import { SectionLabel } from '@/components/devbraid/chips'
import { ApiKeysSection } from '@/components/devbraid/api-keys-section'
import { useAuth } from '@/context/AuthContext'
import authService from '@/services/auth.service'
import { RefreshCw, Eye, EyeOff, Save, Key, Moon, Bell, Shield, Globe } from 'lucide-react'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState(user?.fullName || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [tz, setTz] = useState('UTC')

  // Password state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    setPasswordSaving(true)
    setPasswordError(null)
    setPasswordSaved(false)
    try {
      await authService.updatePassword({ currentPassword, newPassword })
      setPasswordSaved(true)
      setShowPasswordForm(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 2000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change password'
      setPasswordError(msg)
    } finally {
      setPasswordSaving(false)
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
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email
              </label>
              <input
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

        {/* Password Section */}
        <section className="rounded-xl bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3">
            <Shield className="h-4 w-4 text-warning-fg" />
            <h2 className="text-sm font-medium text-foreground">Password</h2>
          </div>
          {!showPasswordForm ? (
            <button
              type="button"
              onClick={() => setShowPasswordForm(true)}
              className="btn btn-ghost btn-md"
            >
              Change password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 pr-9 rounded-lg bg-surface-2 border border-hairline text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrent ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">New password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-3 py-2 pr-9 rounded-lg bg-surface-2 border border-hairline text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {newPassword !== confirmPassword && confirmPassword && (
                  <p className="text-xs text-danger-fg mt-1">Passwords do not match</p>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving || newPassword !== confirmPassword || !currentPassword}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {passwordSaving && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  Update password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setPasswordError(null)
                  }}
                  className="px-4 py-2 rounded-lg border border-hairline text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
              {passwordSaved && (
                <p className="text-xs text-success-fg">Password updated successfully!</p>
              )}
              {passwordError && <p className="text-xs text-danger-fg">{passwordError}</p>}
            </form>
          )}
        </section>

        {/* API Keys Section */}
        <section className="rounded-xl bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3">
            <Key className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium text-foreground">API Keys</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            OpenAI API key is configured via the backend environment variable{' '}
            <code className="text-[10px] px-1 py-0.5 rounded bg-surface-2 font-mono">
              OPENAI_API_KEY
            </code>
            .
          </p>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-2 border border-hairline">
            <div className="h-2 w-2 rounded-full bg-success-fg" />
            <span className="text-xs text-foreground">OpenAI integration ready</span>
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
            DevBraid is dark-only — obsidian canvas, bronze accents. One theme to design, build,
            and maintain.
          </p>
        </section>

        {/* Timezone Section */}
        <section className="rounded-xl bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3">
            <Globe className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium text-foreground">Timezone</h2>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={tz}
              onChange={(e) => setTz(e.target.value)}
              className="select w-full max-w-sm rounded-lg border border-hairline bg-surface-2 px-3 py-2 text-sm text-foreground"
            >
              <option value="UTC">UTC</option>
              <option value="Europe/Amsterdam">Europe/Amsterdam</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
            <span className="text-[10px] text-muted-foreground">For decision-note timestamps</span>
          </div>
        </section>

        {/* API Keys */}
        <ApiKeysSection />

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
