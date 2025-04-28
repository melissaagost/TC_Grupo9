import { Calendar, BookOpen, Users } from "lucide-react";

const icons = {
  calendar: Calendar,
  book: BookOpen,
  user: Users,
};

interface FeatureCardProps {
  icon: keyof typeof icons;
  title: string;
  description: string;
  color: string;
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  const IconComponent = icons[icon];

  return (
    <div className="bg-eggshell-whitedove shadow-md rounded-lg p-6 text-left hover:scale-105 transition-transform duration-300">

      {/* Icon circle */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color}  mb-4`}>
        <IconComponent size={24} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-playfair text-gray-700 font-bold mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-700 font-raleway text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;
