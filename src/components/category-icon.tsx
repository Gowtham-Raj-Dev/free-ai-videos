import {
  Sparkles,
  Flame,
  Clock,
  Star,
  Cat,
  Castle,
  Laptop,
  Car,
  Laugh,
  Gem,
  Droplet,
  BookOpen,
  Shield,
  Wrench,
  Heart,
  Leaf,
  HelpCircle
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Clock,
  Star,
  Cat,
  Castle,
  Laptop,
  Car,
  Laugh,
  Gem,
  Droplet,
  BookOpen,
  Shield,
  Wrench,
  Heart,
  Leaf,
};

export function CategoryIcon({
  name,
  size = 18,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = iconMap[name] || HelpCircle;
  return <Icon size={size} className={className} />;
}
