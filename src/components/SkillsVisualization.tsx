import { motion } from 'motion/react';
import { ExternalLink, TrendingUp } from 'lucide-react';
import { React, useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import D3RadarChart from './D3RadarChart';

export default function SkillsVisualization() {
  const [skillData, setSkillData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSkills();
      if (data && data.length > 0) {
        setSkillData(data);
      } else {
        setSkillData(defaultSkillData);
      }
    } catch (error) {
      console.error('Failed to load skills:', error);
      setSkillData(defaultSkillData);
    } finally {
      setLoading(false);
    }
  };

  const defaultSkillData = [
    { skill: 'Research', current: 90, target: 95 },
    { skill: 'Teaching', current: 85, target: 90 },
    { skill: 'Leadership', current: 65, target: 85 },
    { skill: 'Digital', current: 70, target: 90 },
    { skill: 'Domain Expertise', current: 92, target: 95 },
    { skill: 'Communication', current: 80, target: 85 },
  ];

  const skillGaps = [
    {
      skill: 'Leadership',
      current: 65,
      target: 85,
      gap: 20,
      recommendation: 'Academic Leadership Excellence FDP',
      date: 'Jan 15-20, 2025',
      match: 94,
    },
    {
      skill: 'Digital',
      current: 70,
      target: 90,
      gap: 20,
      recommendation: 'Digital Transformation in Education',
      date: 'Feb 5-8, 2025',
      match: 88,
    },
  ];

  const skillTimeline = [
    { date: 'Nov 2024', title: 'Advanced Research Methods', category: 'Research', color: '#0096FF' },
    { date: 'Oct 2024', title: 'Data Science Certification', category: 'Digital', color: '#9D4EDD' },
    { date: 'Sep 2024', title: 'Effective Teaching Strategies', category: 'Teaching', color: '#06A77D' },
    { date: 'Aug 2024', title: 'Academic Writing Excellence', category: 'Communication', color: '#FFB703' },
    { date: 'Jul 2024', title: 'Domain Expert Certification', category: 'Domain', color: '#00D9FF' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Skill Radar Chart */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-3xl p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl mb-2">Skills Profile</h2>
              <p className="text-[#A0A0A0]">Your current proficiency vs. target for promotion</p>
            </div>

            <div className="h-[500px] flex items-center justify-center">
              {!loading && skillData.length > 0 && <D3RadarChart data={skillData} />}
            </div>

            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#9D4EDD]/50 border-2 border-[#9D4EDD]"></div>
                <span className="text-sm text-[#A0A0A0]">Current Level</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#00D9FF]/20 border-2 border-[#00D9FF] border-dashed"></div>
                <span className="text-sm text-[#A0A0A0]">Target Level</span>
              </div>
            </div>
          </motion.div>

          {/* Skill Gap Analysis */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-[#FFB703]" size={24} />
              <h3 className="text-lg">Skill Gap Analysis</h3>
            </div>

            <div className="space-y-4">
              {skillGaps.map((gap, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4>{gap.skill}</h4>
                          <span className="px-2 py-1 rounded-full bg-[#FFA500]/20 text-[#FFA500] text-xs">
                            Gap: {gap.gap} points
                          </span>
                        </div>
                        <p className="text-sm text-[#A0A0A0]">
                          You're strong in other areas, but {gap.skill.toLowerCase()} skills are crucial for promotion
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-[#A0A0A0] mb-2">
                        <span>Current: {gap.current}</span>
                        <span>Target: {gap.target}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#00D9FF] to-[#9D4EDD]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(gap.current / gap.target) * 100}%` }}
                          transition={{ delay: 0.5, duration: 1 }}
                        />
                      </div>
                    </div>

                    {/* Recommended FDP */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#16213E]/50 border border-white/5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">Recommended: {gap.recommendation}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] text-xs font-mono">
                            {gap.match}% match
                          </span>
                        </div>
                        <p className="text-xs text-[#A0A0A0]">{gap.date}</p>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-[#0F1419] rounded-lg hover:shadow-lg hover:shadow-[#00D9FF]/20 transition-all duration-200 flex items-center gap-2 whitespace-nowrap ml-4">
                        Enroll
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar - Skill Timeline */}
        <div className="space-y-6">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg mb-6">Skill Development Timeline</h3>
            
            <div className="space-y-4 relative">
              {/* Timeline line */}
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00D9FF] via-[#9D4EDD] to-transparent"></div>

              {skillTimeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="relative pl-8"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-0 w-4 h-4 rounded-full border-2"
                    style={{
                      backgroundColor: `${item.color}40`,
                      borderColor: item.color,
                    }}
                  />

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-xs text-[#A0A0A0] mb-1">{item.date}</div>
                    <div className="text-sm mb-1">{item.title}</div>
                    <div
                      className="inline-block px-2 py-0.5 rounded-full text-xs"
                      style={{
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                      }}
                    >
                      {item.category}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skill Distribution */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg mb-4">Skill Distribution</h3>
            <div className="space-y-3">
              {skillData.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#A0A0A0]">{skill.skill}</span>
                    <span className="font-mono">{skill.current}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00D9FF] to-[#9D4EDD]"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.current}%` }}
                      transition={{ delay: 0.6 + index * 0.05, duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}