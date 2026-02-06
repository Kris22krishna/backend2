import { Save, Bell, Mail, Shield, Database, Palette } from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Database className="size-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Platform Settings
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input
                  id="platform-name"
                  defaultValue="Educational Platform"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  defaultValue="support@platform.com"
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">
                    Temporarily disable access to the platform
                  </p>
                </div>
                <Switch id="maintenance-mode" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="guest-access">Allow Guest Access</Label>
                  <p className="text-sm text-gray-500">
                    Allow non-registered users to attempt quizzes
                  </p>
                </div>
                <Switch id="guest-access" defaultChecked />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button className="gap-2">
                <Save className="size-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="size-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Notification Settings
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="alert-notifications">Alert Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications for critical alerts
                  </p>
                </div>
                <Switch id="alert-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-summary">Daily Summary</Label>
                  <p className="text-sm text-gray-500">
                    Receive daily platform activity summary
                  </p>
                </div>
                <Switch id="daily-summary" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="user-signups">New User Signups</Label>
                  <p className="text-sm text-gray-500">
                    Get notified when new users register
                  </p>
                </div>
                <Switch id="user-signups" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="content-reports">Content Reports</Label>
                  <p className="text-sm text-gray-500">
                    Notifications for reported questions
                  </p>
                </div>
                <Switch id="content-reports" defaultChecked />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button className="gap-2">
                <Save className="size-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="size-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Security Settings
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch id="two-factor" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <p className="text-sm text-gray-500">
                    Auto-logout after inactivity
                  </p>
                </div>
                <Switch id="session-timeout" defaultChecked />
              </div>

              <div>
                <Label htmlFor="password-min-length">Minimum Password Length</Label>
                <Input
                  id="password-min-length"
                  type="number"
                  defaultValue="8"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button className="gap-2">
                <Save className="size-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6 mt-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="size-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Email Configuration
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input
                  id="smtp-host"
                  defaultValue="smtp.platform.com"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" defaultValue="587" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="from-email">From Email</Label>
                <Input
                  id="from-email"
                  type="email"
                  defaultValue="noreply@platform.com"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="from-name">From Name</Label>
                <Input
                  id="from-name"
                  defaultValue="Educational Platform"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex gap-2">
                <Button variant="outline">Test Connection</Button>
                <Button className="gap-2">
                  <Save className="size-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 mt-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="size-6 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Appearance Settings
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="brand-color">Brand Color</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input
                    id="brand-color"
                    type="color"
                    defaultValue="#2563eb"
                    className="w-20 h-10"
                  />
                  <span className="text-sm text-gray-600">#2563eb</span>
                </div>
              </div>

              <div>
                <Label htmlFor="logo-url">Logo URL</Label>
                <Input
                  id="logo-url"
                  defaultValue="/logo.png"
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-gray-500">
                    Enable dark mode for admin panel
                  </p>
                </div>
                <Switch id="dark-mode" />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button className="gap-2">
                <Save className="size-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
