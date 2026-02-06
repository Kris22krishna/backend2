import { AlertCircle } from "lucide-react";

interface AlertCardProps {
  message: string;
  severity?: "warning" | "error" | "info";
  onClick?: () => void;
}

export function AlertCard({ message, severity = "warning", onClick }: AlertCardProps) {
  const severityColors = {
    warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
    error: "bg-red-50 border-red-300 text-red-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-l-4 ${severityColors[severity]} ${
        onClick ? "cursor-pointer hover:shadow-md transition-all" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
