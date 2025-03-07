
import { motion } from 'framer-motion';
import { Shirt, Calendar, Cloud, PenTool, LucideIcon, Image, Palette } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay: number;
}

const FeatureCard = ({ title, description, icon: Icon, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="p-6 rounded-2xl glass-effect transition-all duration-300 hover:shadow-md"
  >
    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      title: "Virtual Wardrobe",
      description: "Upload and categorize your clothing items for easy access and organization.",
      icon: Shirt,
    },
    {
      title: "Outfit Builder",
      description: "Create stylish outfit combinations with our intuitive drag-and-drop interface.",
      icon: PenTool,
    },
    {
      title: "Weather Integration",
      description: "Get outfit recommendations based on current and forecasted weather conditions.",
      icon: Cloud,
    },
    {
      title: "Visual Upload",
      description: "Quickly add items to your wardrobe with our photo upload and management tools.",
      icon: Image,
    },
    {
      title: "Calendar Planning",
      description: "Plan your outfits ahead of time with our integrated calendar system.",
      icon: Calendar,
    },
    {
      title: "Style Suggestions",
      description: "Receive personalized outfit suggestions based on your wardrobe and style preferences.",
      icon: Palette,
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how our platform helps you organize your wardrobe and simplify outfit planning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
