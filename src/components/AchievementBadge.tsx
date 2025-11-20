import { motion } from 'motion/react';
import {React} from "react" ;
interface AchievementBadgeProps {
  label: string;
  icon: string;
  color: string;
  delay?: number;
}

export default function AchievementBadge({ label, icon, color, delay = 0 }: AchievementBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.1, y: -2 }}
      className="relative group"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl backdrop-blur-xl border-2 cursor-pointer"
        style={{
          backgroundColor: `${color}20`,
          borderColor: `${color}40`,
        }}
      >
        {icon}
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#16213E] border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap text-xs z-10">
        {label}
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
