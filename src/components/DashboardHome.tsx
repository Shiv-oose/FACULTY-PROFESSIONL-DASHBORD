import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Award, BookOpen, Users, Calendar } from 'lucide-react';
import { React, useState } from 'react';
import CareerProgress from './CareerProgress';
import AchievementBadge from './AchievementBadge';
import AddPublicationDialog from './AddPublicationDialog';
import UpdateSkillsDialog from './UpdateSkillsDialog';

interface DashboardHomeProps {
  onNavigate: (view: string) => void;
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const [isAddPublicationOpen, setIsAddPublicationOpen] = useState(false);
  const [isUpdateSkillsOpen, setIsUpdateSkillsOpen] = useState(false);
  const metrics = [
    {
      label: 'Total Publications',
      value: 82,
      trend: 12,
      status: 'good',
      icon: BookOpen,
      color: 'from-[#0096FF] to-[#0077BE]',
    },
    {
      label: 'H-Index',
      value: 24,
      trend: 3,
      status: 'good',
      icon: Award,
      color: 'from-[#FFB703] to-[#FCA311]',
    },
    {
      label: 'FDPs Completed',
      value: 12,
      trend: 2,
      status: 'good',
      icon: Calendar,
      color: 'from-[#06A77D] to-[#118B7D]',
    },
    {
      label: 'Active Collaborations',
      value: 18,
      trend: -1,
      status: 'neutral',
      icon: Users,
      color: 'from-[#9D4EDD] to-[#7B2CBF]',
    },
  ];

  const thisMonth = [
    { label: 'Papers published', value: 3 },
    { label: 'FDPs attended', value: 1 },
    { label: 'New skills', value: 2 },
    { label: 'Collaborations', value: 4 },
  ];

  const achievements = [
    { label: 'Top Publisher', icon: '🏆', color: '#FFB703' },
    { label: '10+ FDPs', icon: '🎓', color: '#06A77D' },
    { label: 'H-Index 20+', icon: '⭐', color: '#00D9FF' },
    { label: 'Team Leader', icon: '👥', color: '#9D4EDD' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,350px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Career Progress Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-[#9D4EDD]/10 rounded-3xl blur-3xl"></div>
            <div className="relative backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Career Progress</h2>
                  <p className="text-[#A0A0A0]">On track for promotion to Full Professor</p>
                </div>
                <div className="flex gap-2">
                  {achievements.map((achievement, index) => (
                    <AchievementBadge
                      // key={achievement.label}
                      label={achievement.label}
                      icon={achievement.icon}
                      color={achievement.color}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </div>
              <CareerProgress />
            </div>
          </motion.div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-10 transition-opacity rounded-2xl`}></div>
                  <div className="relative backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-200 hover:transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                        metric.status === 'good' ? 'bg-[#00D9FF]/20 text-[#00D9FF]' : 'bg-[#FFA500]/20 text-[#FFA500]'
                      }`}>
                        {metric.trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="text-sm font-mono">{Math.abs(metric.trend)}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-mono">{metric.value}</div>
                      <div className="text-sm text-[#A0A0A0]">{metric.label}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { text: 'Published "AI in Education" in IEEE Transactions', time: '2 days ago', type: 'publication' },
                { text: 'Completed Advanced Research Methodology FDP', time: '5 days ago', type: 'fdp' },
                { text: 'New collaboration with Dr. James Wilson started', time: '1 week ago', type: 'collab' },
                { text: 'Awarded "Excellence in Teaching" certificate', time: '2 weeks ago', type: 'achievement' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'publication' ? 'bg-[#0096FF]' :
                    activity.type === 'fdp' ? 'bg-[#06A77D]' :
                    activity.type === 'collab' ? 'bg-[#9D4EDD]' :
                    'bg-[#FFB703]'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-[#A0A0A0] mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* This Month Snapshot */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg mb-4">This Month</h3>
            <div className="space-y-4">
              {thisMonth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-[#A0A0A0]">{item.label}</span>
                  <span className="text-2xl font-mono text-[#00D9FF]">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setIsAddPublicationOpen(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-[#0F1419] rounded-xl hover:shadow-lg hover:shadow-[#00D9FF]/20 transition-all duration-200 hover:transform hover:-translate-y-0.5"
              >
                Add Publication
              </button>
              <button
                onClick={() => onNavigate('fdp')}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Register for FDP
              </button>
              <button
                onClick={() => setIsUpdateSkillsOpen(true)}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Update Skills
              </button>
            </div>
          </motion.div>

          {/* Suggested FDPs */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg mb-4">Suggested FDPs</h3>
            <div className="space-y-3">
              {[
                { title: 'Leadership in Academia', match: 92, date: 'Dec 15-17' },
                { title: 'Digital Pedagogy', match: 85, date: 'Jan 8-10' },
              ].map((fdp, index) => (
                <div key={index} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{fdp.title}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] font-mono">
                      {fdp.match}%
                    </span>
                  </div>
                  <div className="text-xs text-[#A0A0A0]">{fdp.date}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <AddPublicationDialog
        isOpen={isAddPublicationOpen}
        onOpenChange={setIsAddPublicationOpen}
        onSuccess={() => { /* Optionally refresh data here */ }}
      />

      <UpdateSkillsDialog
        isOpen={isUpdateSkillsOpen}
        onOpenChange={setIsUpdateSkillsOpen}
        onSuccess={() => { /* Optionally refresh data here */ }}
      />
    </div>
  );
}
