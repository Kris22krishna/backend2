import { useState, useEffect } from "react";
import { StatCard } from "./StatCard";
import { TableCard } from "./TableCard";
import { AlertCard } from "./AlertCard";
import { ActivityFeed } from "./ActivityFeed";
import { AlertModal } from "./AlertModal";
import {
  Users,
  GraduationCap,
  UserCheck,
  Eye,
  FileQuestion,
  Database,
  Activity,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

// Dummy Data
const platformHealthData = [
  { title: "Total Students", value: 1240, icon: <GraduationCap className="size-5" /> },
  { title: "Total Teachers", value: 48, icon: <Users className="size-5" /> },
  { title: "Total Parents", value: 980, icon: <UserCheck className="size-5" /> },
  { title: "Guest Users Today", value: 312, icon: <Eye className="size-5" /> },
  { title: "Quizzes Attempted Today", value: 860, icon: <FileQuestion className="size-5" /> },
  { title: "Questions in Bank", value: 5420, icon: <Database className="size-5" /> },
];

const todaysActivityData = [
  { Metric: "Students active today", Count: 320 },
  { Metric: "Quizzes attempted", Count: 540 },
  { Metric: "New users", Count: 12 },
  { Metric: "Questions generated", Count: 85 },
];

const alertsData = [
  {
    id: 1,
    message: "27 students inactive for 3+ days",
    severity: "warning" as const,
    details: {
      title: "Student Inactivity Alert",
      description: "27 students haven't logged in for 3 or more days",
      details: [
        "Sarah Johnson - Last active: 4 days ago",
        "Michael Chen - Last active: 5 days ago",
        "Emma Williams - Last active: 3 days ago",
        "...and 24 more students",
      ],
    },
  },
  {
    id: 2,
    message: "Fractions accuracy dropping platform-wide",
    severity: "error" as const,
    details: {
      title: "Critical Skill Performance Drop",
      description: "Fractions topic showing significant accuracy decline",
      details: [
        "Current average accuracy: 41%",
        "Previous week average: 58%",
        "Drop of 17 percentage points",
        "Affecting 850+ students across all grades",
      ],
    },
  },
  {
    id: 3,
    message: "3 teachers haven't created quizzes this week",
    severity: "warning" as const,
    details: {
      title: "Teacher Engagement Alert",
      description: "Some teachers have not created content recently",
      details: [
        "Mrs. Anderson - Last quiz: 8 days ago",
        "Mr. Thompson - Last quiz: 10 days ago",
        "Ms. Rodriguez - Last quiz: 9 days ago",
      ],
    },
  },
  {
    id: 4,
    message: "12 guests attempted quizzes but didn't sign up",
    severity: "info" as const,
    details: {
      title: "Guest Conversion Opportunity",
      description: "Active guests who haven't registered",
      details: [
        "Average quiz attempts per guest: 3.4",
        "Most attempted topic: Multiplication",
        "Peak activity time: 3-5 PM",
        "Conversion rate this week: 15%",
      ],
    },
  },
];

const skillTroubleData = [
  { Skill: "Fractions", "Avg Accuracy": "41%", Attempts: 1200 },
  { Skill: "Ratios", "Avg Accuracy": "52%", Attempts: 980 },
  { Skill: "Decimals", "Avg Accuracy": "38%", Attempts: 1100 },
];

const userActivityData = [
  { Role: "Students", "Active Today": 320, Inactive: 45 },
  { Role: "Teachers", "Active Today": 28, Inactive: 3 },
  { Role: "Parents", "Active Today": 190, Inactive: 22 },
];

const activityFeedData = [
  { id: 1, message: "Teacher Rahul created a quiz on Algebra", timestamp: "2 minutes ago", icon: <Activity className="size-4" /> },
  { id: 2, message: "40 students attempted Decimals Quiz", timestamp: "5 minutes ago", icon: <FileQuestion className="size-4" /> },
  { id: 3, message: "Parent logged in after 10 days", timestamp: "8 minutes ago", icon: <UserCheck className="size-4" /> },
  { id: 4, message: "15 guests practiced Fractions", timestamp: "12 minutes ago", icon: <Eye className="size-4" /> },
  { id: 5, message: "Teacher Sarah updated Geometry template", timestamp: "15 minutes ago", icon: <Activity className="size-4" /> },
  { id: 6, message: "New user registration: Emily Johnson", timestamp: "18 minutes ago", icon: <Users className="size-4" /> },
  { id: 7, message: "Quiz completed: Advanced Trigonometry", timestamp: "22 minutes ago", icon: <CheckCircle2 className="size-4" /> },
  { id: 8, message: "25 students active in Multiplication practice", timestamp: "25 minutes ago", icon: <GraduationCap className="size-4" /> },
  { id: 9, message: "Teacher Mike created 5 new questions", timestamp: "30 minutes ago", icon: <BookOpen className="size-4" /> },
  { id: 10, message: "Parent reviewed student progress report", timestamp: "35 minutes ago", icon: <UserCheck className="size-4" /> },
];

const questionBankLowAccuracy = [
  { question: "Simplify 3/12 to lowest terms", accuracy: "28%", attempts: 450 },
  { question: "Convert 0.75 to a fraction", accuracy: "31%", attempts: 520 },
  { question: "What is 2/3 + 1/4?", accuracy: "25%", attempts: 680 },
];

const questionBankMostUsed = [
  { question: "What is 5 × 7?", uses: 1250, accuracy: "92%" },
  { question: "Solve: 10 + 15", uses: 1180, accuracy: "95%" },
  { question: "What is 100 ÷ 4?", uses: 1050, accuracy: "88%" },
];

const questionBankRecentlyAdded = [
  { question: "Calculate the area of a triangle", addedBy: "Teacher Rahul", date: "Feb 3, 2026" },
  { question: "Solve for x: 2x + 5 = 15", addedBy: "Teacher Sarah", date: "Feb 2, 2026" },
  { question: "Find the perimeter of a rectangle", addedBy: "Teacher Mike", date: "Feb 1, 2026" },
];

export function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  useEffect(() => {
    // Simulate loading for 1.5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAlertClick = (alert: any) => {
    setSelectedAlert(alert.details);
    setAlertModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Platform Health Cards */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Platform Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {platformHealthData.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              loading={loading}
              onClick={() => console.log(`Open ${stat.title} details`)}
            />
          ))}
        </div>
      </div>

      {/* Section 2: Today's Activity Table */}
      <TableCard
        title="Today's Activity"
        headers={["Metric", "Count"]}
        data={todaysActivityData}
      />

      {/* Section 3: Alerts Panel */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Alerts</h2>
        <div className="space-y-4">
          {alertsData.map((alert) => (
            <AlertCard
              key={alert.id}
              message={alert.message}
              severity={alert.severity}
              onClick={() => handleAlertClick(alert)}
            />
          ))}
        </div>
      </div>

      {/* Section 4: Skill Trouble Spotlight */}
      <TableCard
        title="Skill Trouble Spotlight"
        headers={["Skill", "Avg Accuracy", "Attempts"]}
        data={skillTroubleData}
        onRowClick={(row) => console.log("Open skill details:", row)}
      />

      {/* Section 5: User Activity Snapshot */}
      <TableCard
        title="User Activity Snapshot"
        headers={["Role", "Active Today", "Inactive"]}
        data={userActivityData}
        onRowClick={(row) => console.log("Open user activity:", row)}
      />

      {/* Section 6: Live Activity Feed */}
      <ActivityFeed activities={activityFeedData} autoScroll={true} />

      {/* Section 7: Question Bank Health */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Question Bank Health</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Low Accuracy Questions */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Low Accuracy (&lt;30%)</h3>
            </div>
            <div className="p-6 space-y-4">
              {questionBankLowAccuracy.map((q, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => console.log("View question details:", q.question)}
                >
                  <p className="text-sm text-gray-900 mb-2">{q.question}</p>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Accuracy: {q.accuracy}</span>
                    <span>{q.attempts} attempts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Used Questions */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Most Used Questions</h3>
            </div>
            <div className="p-6 space-y-4">
              {questionBankMostUsed.map((q, index) => (
                <div
                  key={index}
                  className="p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => console.log("View question details:", q.question)}
                >
                  <p className="text-sm text-gray-900 mb-2">{q.question}</p>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{q.uses} uses</span>
                    <span>Accuracy: {q.accuracy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Added */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Recently Added</h3>
            </div>
            <div className="p-6 space-y-4">
              {questionBankRecentlyAdded.map((q, index) => (
                <div
                  key={index}
                  className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => console.log("View question details:", q.question)}
                >
                  <p className="text-sm text-gray-900 mb-2">{q.question}</p>
                  <div className="text-xs text-gray-600">
                    <p>By: {q.addedBy}</p>
                    <p>{q.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        open={alertModalOpen}
        onOpenChange={setAlertModalOpen}
        alert={selectedAlert}
      />
    </div>
  );
}
