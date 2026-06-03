import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Mail, Bell, Lock, Save, LogOut, GraduationCap } from "lucide-react";
import { Badge } from "./ui/badge";
import subjects from "../data/subjects";

interface TeacherProfileProps {
  teacherName?: string;
  teacherEmail?: string;
  teacherSubjectId?: string;
  onLogout?: () => void;
}

export function TeacherProfile({
  teacherName = "Teacher",
  teacherEmail = "teacher@school.edu",
  teacherSubjectId,
  onLogout,
}: TeacherProfileProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const subjectName = teacherSubjectId
    ? subjects.find((s) => s.id === teacherSubjectId)?.name ?? "General"
    : "All Subjects";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-1">Teacher Profile</h3>
        <p className="text-xs md:text-sm text-slate-500">Manage your account and sign out of the portal</p>
      </div>

      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces"
            alt={teacherName}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl md:text-2xl font-bold mb-1 text-slate-800">{teacherName}</h4>
            <p className="text-sm text-slate-500 mb-2">{teacherEmail}</p>
            <Badge className="bg-indigo-600 text-white">
              <GraduationCap className="w-3 h-3 mr-1 inline" />
              {subjectName} Instructor
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="teacher-name" className="text-sm">Display Name</Label>
            <div className="flex gap-2 mt-1">
              <Input id="teacher-name" defaultValue={teacherName} className="flex-1 text-sm" />
              <Button variant="outline" size="icon" className="shrink-0" type="button">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="teacher-email" className="text-sm">Email Address</Label>
            <div className="flex gap-2 mt-1">
              <Input id="teacher-email" type="email" defaultValue={teacherEmail} className="flex-1 text-sm" />
              <Button variant="outline" size="icon" className="shrink-0" type="button">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
          <Bell className="w-5 h-5" />
          Notifications
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="font-medium text-sm">Submission alerts</p>
              <p className="text-xs text-slate-500">Notify when students complete assignments</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <p className="font-medium text-sm">Email notifications</p>
                <p className="text-xs text-slate-500">Grade audit reminders via email</p>
              </div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
          <Lock className="w-5 h-5" />
          Security
        </h4>
        <Button variant="outline" className="w-full justify-start gap-2" type="button">
          <Lock className="w-4 h-4" />
          Change Password
        </Button>
      </Card>

      <Card className="p-4 md:p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
          <LogOut className="w-5 h-5" />
          Session
        </h4>
        {onLogout ? (
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start gap-2 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
            type="button"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        ) : (
          <p className="text-sm text-slate-500">Logout is unavailable in this view.</p>
        )}
      </Card>
    </div>
  );
}
