import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { User, Mail, Bell, Moon, Lock, Globe, Save, LogOut } from "lucide-react";
import { Badge } from "./ui/badge";

interface StudentProfileProps {
  studentName?: string;
  studentEmail?: string;
  classRank?: number;
  onLogout?: () => void;
}

export function StudentProfile({
  studentName = "Nobita Nobi",
  studentEmail = "nobita.nobi@school.edu",
  classRank = 3,
  onLogout,
}: StudentProfileProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50 pb-16 md:pb-0">
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Student Profile</h2>
            <p className="text-sm md:text-base text-gray-600">Manage your account settings and preferences</p>
          </div>

          {/* Profile Information */}
          <Card className="p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces"
                alt="Nobita Nobi"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-1">{studentName}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-2">{studentEmail}</p>
                <Badge className="bg-blue-600 text-white">
                  Class Rank: #{classRank}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm md:text-base">Full Name</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="name"
                    defaultValue={studentName}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm md:text-base">Email Address</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="email"
                    type="email"
                    defaultValue={studentEmail}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-4 md:p-6 mb-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Moon className="w-5 h-5 text-gray-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base">Dark Mode</p>
                    <p className="text-xs md:text-sm text-gray-500">Enable dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Bell className="w-5 h-5 text-gray-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base">Push Notifications</p>
                    <p className="text-xs md:text-sm text-gray-500">Receive assignment reminders</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Mail className="w-5 h-5 text-gray-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base">Email Notifications</p>
                    <p className="text-xs md:text-sm text-gray-500">Get updates via email</p>
                  </div>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-4 md:p-6 mb-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security
            </h3>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Lock className="w-4 h-4" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <User className="w-4 h-4" />
                Update Profile Picture
              </Button>
            </div>
          </Card>

          {/* Session */}
          <Card className="p-4 md:p-6 mb-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Session
            </h3>

            <div className="space-y-3">
              {onLogout && (
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="w-full justify-start gap-2 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
