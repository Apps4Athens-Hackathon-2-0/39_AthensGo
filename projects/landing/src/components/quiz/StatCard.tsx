import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  colorClass: string;
  delay?: number;
}

const StatCard = ({ icon: Icon, value, label, colorClass, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`bg-white/90 backdrop-blur-sm rounded-2xl p-5 border-2 ${colorClass} shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
    >
      <Icon className={`w-8 h-8 mx-auto mb-2 ${colorClass.replace('border-', 'text-')}`} />
      <div className="text-3xl font-black text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
};

export default StatCard;
