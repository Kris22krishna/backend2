import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const mockAlerts = [
  {
    id: "ALT-001",
    title: "27 students inactive for 3+ days",
    description: "These students haven't logged in for more than 3 days",
    severity: "critical",
    timestamp: "5 minutes ago",
    status: "open",
    affectedCount: 27,
  },
  {
    id: "ALT-002",
    title: "Skill accuracy dropping: Fractions",
    description: "Fractions skill accuracy dropped 17% in the last week",
    severity: "warning",
    timestamp: "2 hours ago",
    status: "open",
    affectedCount: 245,
  },
  {
    id: "ALT-003",
    title: "5 questions with high report count",
    description: "Questions have been reported for potential errors",
    severity: "warning",
    timestamp: "1 day ago",
    status: "investigating",
    affectedCount: 5,
  },
  {
    id: "ALT-004",
    title: "Server response time elevated",
    description: "API response times 20% higher than baseline",
    severity: "info",
    timestamp: "3 hours ago",
    status: "resolved",
    affectedCount: 0,
  },
];

export function AlertsPage() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="size-4" />;
      case "investigating":
        return <Clock className="size-4" />;
      case "resolved":
        return <CheckCircle className="size-4" />;
      case "dismissed":
        return <XCircle className="size-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-700 border-red-200";
      case "investigating":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-700 border-green-200";
      case "dismissed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Open Alerts</p>
          <p className="text-2xl font-bold text-red-600">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Critical</p>
          <p className="text-2xl font-bold text-red-600">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Under Investigation</p>
          <p className="text-2xl font-bold text-yellow-600">7</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Resolved Today</p>
          <p className="text-2xl font-bold text-green-600">18</p>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-6 text-red-600 mt-1" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">
              3 Critical Alerts Require Immediate Attention
            </h3>
            <p className="text-sm text-red-700">
              Review and take action on critical alerts to maintain platform
              health.
            </p>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border-2 p-6 ${getSeverityColor(
              alert.severity
            )}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={getSeverityColor(alert.severity)}
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(alert.status)}>
                    <span className="mr-1">{getStatusIcon(alert.status)}</span>
                    {alert.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {alert.title}
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  {alert.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>🕐 {alert.timestamp}</span>
                  {alert.affectedCount > 0 && (
                    <span>👥 {alert.affectedCount} affected</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-300">
              {alert.status === "open" && (
                <>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Investigate
                  </Button>
                  <Button size="sm" variant="outline">
                    Mark Resolved
                  </Button>
                  <Button size="sm" variant="outline" className="text-gray-600">
                    Dismiss
                  </Button>
                </>
              )}
              {alert.status === "investigating" && (
                <>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Mark Resolved
                  </Button>
                </>
              )}
              {alert.status === "resolved" && (
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
