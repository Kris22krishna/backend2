import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { User, Bell, BookOpen, Plus, Trash2, School } from "lucide-react";
import { Badge } from "../components/ui/badge";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    studentMissing: true,
    assignmentDue: true,
    classScheduled: true,
    performanceAlerts: true,
    activityReminders: false,
    weeklyReports: true,
    achievementNotifications: true,
    skillMastery: true,
  });

  const [profile, setProfile] = useState({
    name: "Mr. Smith",
    email: "smith@school.com",
    phone: "+1 (555) 123-4567",
    subject: "Mathematics",
  });

  const [schoolDetails, setSchoolDetails] = useState({
    schoolName: "Lincoln High School",
    schoolEmail: "contact@lincolnhigh.edu",
    schoolPhone: "+1 (555) 987-6543",
    schoolAddress: "123 Education Avenue, Springfield, ST 12345",
  });

  const [classes, setClasses] = useState([
    { id: 1, grade: "Grade 8", subject: "Algebra", students: 25, schedule: "Mon, Wed, Fri 9:00 AM" },
    { id: 2, grade: "Grade 9", subject: "Geometry", students: 22, schedule: "Tue, Thu 10:00 AM" },
    { id: 3, grade: "Grade 10", subject: "Calculus", students: 18, schedule: "Mon, Wed 2:00 PM" },
  ]);

  const [newClass, setNewClass] = useState({
    grade: "",
    subject: "",
    students: "",
    schedule: "",
  });

  const handleNotificationToggle = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleProfileUpdate = () => {
    // In real app, would save to backend
    alert("Profile updated successfully!");
  };

  const handleAddClass = () => {
    if (newClass.grade && newClass.subject && newClass.students && newClass.schedule) {
      setClasses([
        ...classes,
        {
          id: classes.length + 1,
          grade: newClass.grade,
          subject: newClass.subject,
          students: parseInt(newClass.students),
          schedule: newClass.schedule,
        },
      ]);
      setNewClass({ grade: "", subject: "", students: "", schedule: "" });
      alert("Class added successfully!");
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleDeleteClass = (id: number) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <Header title="Settings" />

        <p className="text-gray-600 mb-8">Manage your account and notification preferences</p>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="size-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="size-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="classes">
              <BookOpen className="size-4 mr-2" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="school">
              <School className="size-4 mr-2" />
              School Details
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="size-24">
                    <AvatarFallback className="bg-blue-600 text-white text-2xl">
                      MS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-medium">{profile.name}</h3>
                    <p className="text-gray-600">{profile.subject} Teacher</p>
                    <Button variant="outline" className="mt-2" size="sm">
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Specialization</Label>
                    <Input
                      id="subject"
                      value={profile.subject}
                      onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleProfileUpdate} className="bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Student Missing Class</h4>
                      <p className="text-sm text-gray-500">Get notified when a student is absent</p>
                    </div>
                    <Switch
                      checked={notifications.studentMissing}
                      onCheckedChange={() => handleNotificationToggle("studentMissing")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Assignment Due Reminders</h4>
                      <p className="text-sm text-gray-500">Remind when assignments are due soon</p>
                    </div>
                    <Switch
                      checked={notifications.assignmentDue}
                      onCheckedChange={() => handleNotificationToggle("assignmentDue")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Class Scheduled Notifications</h4>
                      <p className="text-sm text-gray-500">Alert before scheduled classes start</p>
                    </div>
                    <Switch
                      checked={notifications.classScheduled}
                      onCheckedChange={() => handleNotificationToggle("classScheduled")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Performance Alerts</h4>
                      <p className="text-sm text-gray-500">Get notified when performance drops significantly</p>
                    </div>
                    <Switch
                      checked={notifications.performanceAlerts}
                      onCheckedChange={() => handleNotificationToggle("performanceAlerts")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Activity Reminders</h4>
                      <p className="text-sm text-gray-500">Remind when student hasn't practiced recently</p>
                    </div>
                    <Switch
                      checked={notifications.activityReminders}
                      onCheckedChange={() => handleNotificationToggle("activityReminders")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Weekly Reports</h4>
                      <p className="text-sm text-gray-500">Receive weekly progress summaries via email</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={() => handleNotificationToggle("weeklyReports")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Achievement Notifications</h4>
                      <p className="text-sm text-gray-500">Get notified about milestones and achievements</p>
                    </div>
                    <Switch
                      checked={notifications.achievementNotifications}
                      onCheckedChange={() => handleNotificationToggle("achievementNotifications")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Skill Mastery Updates</h4>
                      <p className="text-sm text-gray-500">Notifications when students master new skills</p>
                    </div>
                    <Switch
                      checked={notifications.skillMastery}
                      onCheckedChange={() => handleNotificationToggle("skillMastery")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Classes</CardTitle>
                  <CardDescription>Classes you are currently teaching</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-lg">{classItem.subject}</h4>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {classItem.grade}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {classItem.students} students enrolled
                          </p>
                          <p className="text-sm text-gray-500">Schedule: {classItem.schedule}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClass(classItem.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add New Class</CardTitle>
                  <CardDescription>Create a new class to teach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade Level</Label>
                      <Input
                        id="grade"
                        placeholder="e.g., Grade 8"
                        value={newClass.grade}
                        onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="e.g., Algebra"
                        value={newClass.subject}
                        onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="students">Number of Students</Label>
                      <Input
                        id="students"
                        type="number"
                        placeholder="e.g., 25"
                        value={newClass.students}
                        onChange={(e) => setNewClass({ ...newClass, students: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schedule">Schedule</Label>
                      <Input
                        id="schedule"
                        placeholder="e.g., Mon, Wed 9:00 AM"
                        value={newClass.schedule}
                        onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleAddClass} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="size-4 mr-2" />
                    Add Class
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* School Details Tab */}
          <TabsContent value="school">
            <Card>
              <CardHeader>
                <CardTitle>School Details</CardTitle>
                <CardDescription>Manage school information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={schoolDetails.schoolName}
                      onChange={(e) => setSchoolDetails({ ...schoolDetails, schoolName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolEmail">School Email</Label>
                    <Input
                      id="schoolEmail"
                      type="email"
                      value={schoolDetails.schoolEmail}
                      onChange={(e) => setSchoolDetails({ ...schoolDetails, schoolEmail: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolPhone">School Phone</Label>
                    <Input
                      id="schoolPhone"
                      type="tel"
                      value={schoolDetails.schoolPhone}
                      onChange={(e) => setSchoolDetails({ ...schoolDetails, schoolPhone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolAddress">School Address</Label>
                    <Input
                      id="schoolAddress"
                      value={schoolDetails.schoolAddress}
                      onChange={(e) => setSchoolDetails({ ...schoolDetails, schoolAddress: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => alert("School details saved successfully!")} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}