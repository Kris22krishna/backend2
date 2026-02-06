import { useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";

interface ActivityItem {
  id: number;
  message: string;
  timestamp: string;
  icon?: React.ReactNode;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  autoScroll?: boolean;
}

export function ActivityFeed({ activities, autoScroll = true }: ActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const scroll = () => {
          const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
          let currentScroll = scrollContainer.scrollTop;
          
          const interval = setInterval(() => {
            currentScroll += 1;
            scrollContainer.scrollTop = currentScroll;
            
            if (currentScroll >= maxScroll) {
              currentScroll = 0;
              scrollContainer.scrollTop = 0;
            }
          }, 50);
          
          return interval;
        };
        
        const interval = scroll();
        return () => clearInterval(interval);
      }
    }
  }, [autoScroll, activities]);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Live Activity Feed</h2>
      </div>
      <ScrollArea ref={scrollRef} className="h-80">
        <div className="p-6 space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {activity.icon && (
                <div className="text-blue-600 mt-1">{activity.icon}</div>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
