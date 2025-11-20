import { motion } from 'motion/react';
import { Target, TrendingUp, CheckCircle, Circle, Award, BookOpen, Users, Briefcase } from 'lucide-react';
import { React, useState, useEffect } from 'react';


export default function CareerRoadmap() {
  const promotionChecklist = [
    { item: 'Publications in top-tier venues', completed: true, value: '82/80' },
    { item: 'FDP completion requirement', completed: true, value: '12/10' },
    { item: 'Leadership & administrative skills', completed: false, value: '8/12' },
    { item: 'Teaching excellence rating', completed: true, value: '4.8/4.5' },
    { item: 'Grant funding secured', completed: false, value: '$120K/$150K' },
    { item: 'PhD student supervision', completed: true, value: '6/5' },
  ];

  const careerTimeline = [
    {
      role: 'Assistant Professor',
      year: '2018',
      status: 'completed',
      icon: Briefcase,
    },
    {
      role: 'Associate Professor',
      year: '2020',
      status: 'completed',
      icon: Award,
    },
    {
      role: 'Senior Associate Professor',
      year: 'Current',
      status: 'current',
      icon: Target,
    },
    {
      role: 'Full Professor',
      year: '2026',
      status: 'upcoming',
      icon: Award,
      progress: 78,
    },
    {
      role: 'Department Head',
      year: '2028+',
      status: 'future',
      icon: Users,
    },
  ];

  const nextSteps = [
    {
      title: 'Develop Leadership Skills',
      description: 'Complete advanced leadership FDP to meet promotion requirements',
      action: 'Enroll in Leadership FDP',
      priority: 'high',
      icon: Users,
      color: '#FFA500',
      match: 94,
    },
    {
      title: 'Secure Research Grant',
      description: 'Apply for $50K research grant to meet funding requirement',
      action: 'View Grant Opportunities',
      priority: 'high',
      icon: TrendingUp,
      color: '#FFA500',
      match: 88,
    },
    {
      title: 'Publish in Nature/Science',
      description: 'Target high-impact venues to strengthen publication profile',
      action: 'View Recommended Venues',
      priority: 'medium',
      icon: BookOpen,
      color: '#FFB703',
      match: 85,
    },
    {
      title: 'Expand Collaboration Network',
      description: 'Build interdisciplinary research partnerships',
      action: 'Find Collaborators',
      priority: 'medium',
      icon: Users,
      color: '#00D9FF',
      match: 82,
    },
  ];

  const milestones = [
    {
      quarter: 'Q1 2025',
      tasks: [
        { task: 'Complete Leadership FDP', status: 'pending' },
        { task: 'Submit grant proposal', status: 'pending' },
      ],
    },
    {
      quarter: 'Q2 2025',
      tasks: [
        { task: 'Publish 2 journal papers', status: 'pending' },
        { task: 'Mentor 2 new PhD students', status: 'pending' },
      ],
    },
    {
      quarter: 'Q3 2025',
      tasks: [
        { task: 'Complete digital skills certification', status: 'pending' },
        { task: 'Organize international conference', status: 'pending' },
      ],
    },
    {
      quarter: 'Q4 2025',
      tasks: [
        { task: 'Apply for promotion', status: 'pending' },
        { task: 'Present at 3 major conferences', status: 'pending' },
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="space-y-6">
        {/* Promotion Readiness Meter */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#16213E]/50 backdrop-blur-xl p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-[#9D4EDD]/10 blur-3xl"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl mb-2">Promotion Readiness</h2>
                <p className="text-[#A0A0A0]">Track your progress toward Full Professor</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-4xl font-mono bg-gradient-to-br from-[#00D9FF] to-[#9D4EDD] bg-clip-text text-transparent">
                    78%
                  </div>
                  <div className="text-sm text-[#A0A0A0]">Ready</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotionChecklist.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.completed
                        ? 'bg-gradient-to-br from-[#00D9FF] to-[#00E5CC]'
                        : 'bg-white/10 border-2 border-white/20'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle size={16} className="text-white" />
                    ) : (
                      <Circle size={16} className="text-[#A0A0A0]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={item.completed ? 'text-[#F0F0F0]' : 'text-[#A0A0A0]'}>
                        {item.item}
                      </span>
                      <span className="text-sm font-mono text-[#A0A0A0]">{item.value}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Career Timeline */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl mb-6">Career Timeline</h3>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00D9FF] via-[#9D4EDD] to-[#FFB703]"></div>

                <div className="space-y-8">
                  {careerTimeline.map((stage, index) => {
                    const Icon = stage.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="relative flex items-start gap-6"
                      >
                        {/* Icon */}
                        <div
                          className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center ${
                            stage.status === 'completed'
                              ? 'bg-gradient-to-br from-[#00D9FF] to-[#00E5CC]'
                              : stage.status === 'current'
                              ? 'bg-gradient-to-br from-[#9D4EDD] to-[#7B2CBF]'
                              : 'bg-gradient-to-br from-[#00D9FF] to-[#00E5CC]'
                          }`}
                        >
                          <Icon size={28} className="text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-2">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg">{stage.role}</h4>
                            {stage.status === 'current' && (
                              <span className="px-3 py-1 rounded-full bg-[#9D4EDD]/20 text-[#9D4EDD] text-xs">
                                Current Position
                              </span>
                            )}
                            {stage.status === 'upcoming' && stage.progress && (
                              <span className="px-3 py-1 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] text-xs font-mono">
                                {stage.progress}% ready
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-[#A0A0A0] mb-3">
                            {stage.status === 'completed'
                              ? `Achieved in ${stage.year}`
                              : stage.status === 'current'
                              ? 'Since 2022'
                              : `Projected ${stage.year}`}
                          </div>

                          {stage.progress && (
                            <div className="space-y-2">
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-[#00D9FF] to-[#9D4EDD]"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${stage.progress}%` }}
                                  transition={{ delay: 0.8, duration: 1 }}
                                />
                              </div>
                              <div className="text-xs text-[#A0A0A0]">
                                Estimated 12-18 months to achieve
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Quarterly Milestones */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl mb-6">2025 Milestones</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="text-sm text-[#00D9FF] mb-3">{milestone.quarter}</div>
                    <div className="space-y-2">
                      {milestone.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-start gap-2">
                          <Circle size={16} className="text-[#A0A0A0] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#A0A0A0]">{task.task}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Next Steps */}
          <div className="space-y-6">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg mb-4">Suggested Next Steps</h3>

              <div className="space-y-4">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                    >
                      {step.priority === 'high' && (
                        <div className="absolute top-0 right-0 w-2 h-full bg-[#FFA500]"></div>
                      )}

                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${step.color}20` }}
                          >
                            <Icon size={20} style={{ color: step.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm">{step.title}</h4>
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-mono"
                                style={{
                                  backgroundColor: `${step.color}20`,
                                  color: step.color,
                                }}
                              >
                                {step.match}%
                              </span>
                            </div>
                            <p className="text-xs text-[#A0A0A0]">{step.description}</p>
                          </div>
                        </div>
                        <button className="w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
                          {step.action}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Impact Metrics */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg mb-4">Career Impact</h3>
              <div className="space-y-4">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#00D9FF]/10 to-[#9D4EDD]/10">
                  <div className="text-3xl mb-1">🎯</div>
                  <div className="text-2xl font-mono mb-1">Top 15%</div>
                  <div className="text-xs text-[#A0A0A0]">
                    In your field for publication impact
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-[#A0A0A0]">Research Influence</span>
                    <span className="text-lg font-mono text-[#00D9FF]">92/100</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-[#A0A0A0]">Teaching Excellence</span>
                    <span className="text-lg font-mono text-[#9D4EDD]">96/100</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-[#A0A0A0]">Service & Leadership</span>
                    <span className="text-lg font-mono text-[#FFB703]">78/100</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
