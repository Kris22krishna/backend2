import { Skeleton } from "./ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
}

export function StatCard({ title, value, icon, loading, onClick }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-16" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow p-6 border border-gray-200 transition-all ${
        onClick ? "cursor-pointer hover:shadow-lg hover:border-blue-300 hover:-translate-y-1" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-gray-600">{title}</h3>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
