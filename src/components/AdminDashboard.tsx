import { motion } from 'motion/react';
import { Users, BookOpen, TrendingUp, Award, CheckCircle2, Clock } from 'lucide-react';
import { Card } from './ui/card';
import toast from 'react-hot-toast';
import { React, useState } from 'react';

export default function AdminDashboard() {
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 1,
      faculty: 'Dr. Priya Sharma',
      department: 'Computer Science',
      type: 'FDP Enrollment',
      program: 'Advanced AI & Machine Learning',
      date: '2 hours ago',
      urgent: true
    },
    {
      id: 2,
      faculty: 'Prof. Amit Patel',
      department: 'Electronics',
      type: 'Publication Submission',
      program: 'IEEE Research Paper',
      date: '5 hours ago',
      urgent: false
    },
    {
      id: 3,
      faculty: 'Dr. Meera Singh',
      department: 'Mathematics',
      type: 'FDP Enrollment',
      program: 'Teaching Methodologies Workshop',
      date: '1 day ago',
      urgent: true
    }
  ]);

  const handleApprove = (id: number, faculty: string, program: string) => {
    setPendingApprovals(prev => prev.filter(approval => approval.id !== id));
    toast.success(`Approved ${program} for ${faculty}`);
  };

  const handleReview = (faculty: string, program: string) => {
    toast(`Opening review for ${program} - ${faculty}`);
  };

  const stats = [
    {
      label: 'Total Faculty',
      value: '245',
      change: '+12 this month',
      icon: Users,
      color: '#00D9FF',
      bgColor: 'from-[#00D9FF]/20 to-[#00E5CC]/20'
    },
    {
      label: 'Total Publications',
      value: '1,847',
      change: '+156 this year',
      icon: BookOpen,
      color: '#0096FF',
      bgColor: 'from-[#0096FF]/20 to-[#00D9FF]/20'
    },
    {
      label: 'Avg H-Index',
      value: '18.4',
      change: '+2.3 from last year',
      icon: TrendingUp,
      color: '#FFB703',
      bgColor: 'from-[#FFB703]/20 to-[#FB8500]/20'
    },
    {
      label: 'Active FDPs',
      value: '42',
      change: `${pendingApprovals.length} pending approval`,
      icon: Award,
      color: '#9D4EDD',
      bgColor: 'from-[#9D4EDD]/20 to-[#FF006E]/20'
    }
  ];

  const topFaculty = [
    {
      name: 'Dr. Rajesh Kumar',
      department: 'Physics',
      publications: 87,
      hIndex: 28,
      fdps: 15,
      rank: 1
    },
    {
      name: 'Prof. Anjali Desai',
      department: 'Chemistry',
      publications: 73,
      hIndex: 24,
      fdps: 12,
      rank: 2
    },
    {
      name: 'Dr. Vikram Reddy',
      department: 'Biology',
      publications: 65,
      hIndex: 21,
      fdps: 14,
      rank: 3
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New Publication Added',
      faculty: 'Dr. Sarah Johnson',
      time: '10 minutes ago',
      icon: BookOpen,
      color: '#00D9FF'
    },
    {
      id: 2,
      action: 'FDP Completed',
      faculty: 'Prof. Michael Chen',
      time: '1 hour ago',
      icon: CheckCircle2,
      color: '#06D6A0'
    },
    {
      id: 3,
      action: 'Skill Assessment Updated',
      faculty: 'Dr. Emily Wilson',
      time: '2 hours ago',
      icon: TrendingUp,
      color: '#FFB703'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-[#A0A0A0]">Overview of faculty performance and institutional metrics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor}`}>
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-3xl mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-sm text-[#F0F0F0] mb-2">{stat.label}</div>
                <div className="text-xs text-[#A0A0A0]">{stat.change}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF006E]/20 to-[#9D4EDD]/20 flex items-center justify-center">
                  <Clock size={20} className="text-[#FF006E]" />
                </div>
                <div>
                  <h2 className="text-xl">Pending Approvals</h2>
                  <p className="text-sm text-[#A0A0A0]">{pendingApprovals.length} items require attention</p>
                </div>
              </div>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-[#A0A0A0]">
                <CheckCircle2 size={48} className="mx-auto mb-4 opacity-50" />
                <p>All approvals processed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[#F0F0F0]">{approval.faculty}</span>
                          {approval.urgent && (
                            <span className="px-2 py-0.5 rounded-full bg-[#FF006E]/20 text-[#FF006E] text-xs">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#A0A0A0] mb-1">{approval.department}</p>
                        <p className="text-sm text-[#00D9FF]">{approval.type}: {approval.program}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#A0A0A0] mb-2">{approval.date}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApprove(approval.id, approval.faculty, approval.program)}
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#06D6A0] to-[#06D6A0]/80 text-white text-xs hover:scale-105 transition-transform"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReview(approval.faculty, approval.program)}
                            className="px-3 py-1 rounded-lg bg-white/5 text-[#A0A0A0] text-xs hover:bg-white/10 transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00E5CC]/20 flex items-center justify-center">
                <TrendingUp size={20} className="text-[#00D9FF]" />
              </div>
              <div>
                <h2 className="text-xl">Recent Activity</h2>
                <p className="text-sm text-[#A0A0A0]">Latest updates</p>
              </div>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${activity.color}20` }}
                    >
                      <Icon size={16} style={{ color: activity.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#F0F0F0] mb-1">{activity.action}</p>
                      <p className="text-xs text-[#A0A0A0] truncate">{activity.faculty}</p>
                      <p className="text-xs text-[#A0A0A0]">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Top Performing Faculty */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB703]/20 to-[#FB8500]/20 flex items-center justify-center">
              <Award size={20} className="text-[#FFB703]" />
            </div>
            <div>
              <h2 className="text-xl">Top Performing Faculty</h2>
              <p className="text-sm text-[#A0A0A0]">Based on publications, H-Index, and FDP completion</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {topFaculty.map((faculty) => (
              <div
                key={faculty.rank}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                      faculty.rank === 1 ? 'from-[#FFD700] to-[#FFA500]' :
                      faculty.rank === 2 ? 'from-[#C0C0C0] to-[#A8A8A8]' :
                      'from-[#CD7F32] to-[#B8860B]'
                    } flex items-center justify-center`}>
                      <span className="text-lg">#{faculty.rank}</span>
                    </div>
                    <div>
                      <p className="text-[#F0F0F0]">{faculty.name}</p>
                      <p className="text-xs text-[#A0A0A0]">{faculty.department}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-sm text-[#00D9FF]">{faculty.publications}</div>
                    <div className="text-xs text-[#A0A0A0]">Pubs</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-sm text-[#FFB703]">{faculty.hIndex}</div>
                    <div className="text-xs text-[#A0A0A0]">H-Index</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-sm text-[#9D4EDD]">{faculty.fdps}</div>
                    <div className="text-xs text-[#A0A0A0]">FDPs</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
