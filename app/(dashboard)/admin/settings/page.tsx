'use client'

import { useState } from 'react'
import { Save, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Gospel Ministry',
    siteEmail: 'hello@gospel.org',
    sitePhone: '(555) 123-4567',
    siteAddress: '123 Faith Street, Hope City, ST 12345',
    defaultTimezone: 'America/New_York',
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-primary mb-8">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">General Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                name="siteEmail"
                value={settings.siteEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
              <input
                type="tel"
                name="sitePhone"
                value={settings.sitePhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Address</label>
              <input
                type="text"
                name="siteAddress"
                value={settings.siteAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">System Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Default Timezone</label>
              <select
                name="defaultTimezone"
                value={settings.defaultTimezone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-border"
                />
                <span className="text-foreground font-medium">Maintenance Mode</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-border"
                />
                <span className="text-foreground font-medium">Email Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="autoBackup"
                  checked={settings.autoBackup}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-border"
                />
                <span className="text-foreground font-medium">Automatic Backup</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Backup Section */}
      <div className="mt-8 bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-6">Security & Backup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-foreground mb-2">Last Backup</h3>
            <p className="text-muted-foreground text-sm">Today at 2:30 AM</p>
            <button className="mt-4 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium">
              Backup Now
            </button>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">Database Status</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Healthy</span>
            </div>
            <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium">
              View Database
            </button>
          </div>
        </div>
      </div>

      {/* Alert Section */}
      {settings.maintenanceMode && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="text-yellow-600 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-yellow-900 mb-1">Maintenance Mode is Active</h3>
            <p className="text-sm text-yellow-800">
              Your website is currently in maintenance mode. Visitors will see a maintenance message.
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2 font-medium"
        >
          <Save size={20} /> Save Settings
        </button>

        {saved && (
          <div className="text-green-600 text-sm font-medium">
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  )
}
