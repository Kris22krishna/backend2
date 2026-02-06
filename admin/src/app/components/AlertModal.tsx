import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface AlertDetails {
  title: string;
  description: string;
  details: string[];
}

interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: AlertDetails | null;
}

export function AlertModal({ open, onOpenChange, alert }: AlertModalProps) {
  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{alert.title}</DialogTitle>
          <DialogDescription>{alert.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {alert.details.map((detail, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-800">{detail}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
