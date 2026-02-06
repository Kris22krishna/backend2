import { Activity, Server, Database, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "../ui/badge";

const healthMetrics = [
  {
    name: "API Response Time",
    value: "142ms",
    status: "healthy",
    threshold: "< 200ms",
  },
  {
    name: "Database Queries",
    value: "1,245/min",
    status: "healthy",
    threshold: "< 2,000/min",
  },
  {
    name: "Error Rate",
    value: "0.03%",
    status: "healthy",
    threshold: "< 0.5%",
  },
  {
    name: "Server CPU Usage",
    value: "45%",
    status: "healthy",
    threshold: "< 80%",
  },
  {
    name: "Memory Usage",
    value: "68%",
    status: "warning",
    threshold: "< 75%",
  },
  {
    name: "Active Connections",
    value: "342",
    status: "healthy",
    threshold: "< 1,000",
  },
];

export function SystemHealthPage() {
  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-green-600 flex items-center justify-center">
            <CheckCircle className="size-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-900 mb-1">
              All Systems Operational
            </h2>
            <p className="text-green-700">
              Platform is running smoothly with no critical issues
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Server className="size-10 text-blue-600" />
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              ✓ Healthy
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Server Uptime</p>
          <p className="text-3xl font-bold text-gray-900">99.98%</p>
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Database className="size-10 text-purple-600" />
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              ✓ Healthy
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">Database Health</p>
          <p className="text-3xl font-bold text-gray-900">Optimal</p>
          <p className="text-xs text-gray-500 mt-1">All connections stable</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Zap className="size-10 text-yellow-600" />
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              ✓ Healthy
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">API Performance</p>
          <p className="text-3xl font-bold text-gray-900">142ms</p>
          <p className="text-xs text-gray-500 mt-1">Avg response time</p>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            System Health Metrics
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="size-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  Threshold: {metric.threshold}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                {metric.status === "healthy" ? (
                  <CheckCircle className="size-6 text-green-600" />
                ) : (
                  <AlertTriangle className="size-6 text-yellow-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Incidents (Last 7 Days)
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">
                  Brief API slowdown
                </p>
                <p className="text-sm text-gray-600">
                  Response times elevated for 12 minutes
                </p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                Resolved
              </Badge>
            </div>
            <p className="text-xs text-gray-500">Feb 2, 2024 - 14:23 PM</p>
          </div>
          <div className="text-center py-4 text-gray-500">
            No other incidents in the past 7 days
          </div>
        </div>
      </div>
    </div>
  );
}
