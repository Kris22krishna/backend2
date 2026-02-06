import { Search, Bell, Mail } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-10 w-80"
          />
        </div>
        <div className="relative">
          <Bell className="size-6 text-gray-600 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
        </div>
        <div className="relative">
          <Mail className="size-6 text-gray-600 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
        </div>
        <Avatar>
          <AvatarFallback className="bg-blue-600 text-white">MS</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
