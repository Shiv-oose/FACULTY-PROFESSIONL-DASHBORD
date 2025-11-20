import { motion } from 'motion/react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Award, TrendingUp, ExternalLink, Users } from 'lucide-react';
import { React, useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import D3BubbleChart from './D3BubbleChart';
import D3NetworkGraph from './D3NetworkGraph';

export default function PublicationsDashboard() {
  const [selectedPublication, setSelectedPublication] = useState<number | null>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBubbleView, setShowBubbleView] = useState(false);
  const [showNetworkView, setShowNetworkView] = useState(false);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPublications();
      setPublications(data);
    } catch (error) {
      console.error('Failed to load publications:', error);
      // Use fallback data
      setPublications(fallbackPublications);
    } finally {
      setLoading(false);
    }
  };

  const fallbackPublications = [
    {
      year: 2024,
      title: 'AI-Driven Personalized Learning in Higher Education',
      venue: 'IEEE Transactions on Education',
      citations: 45,
      impact: 3.8,
      tier: 'top',
      coAuthors: ['Dr. Wilson', 'Dr. Patel'],
    },
    {
      year: 2024,
      title: 'Blockchain for Academic Credential Verification',
      venue: 'International Conference on Learning Analytics',
      citations: 32,
      impact: 2.9,
      tier: 'high',
      coAuthors: ['Dr. Kim', 'Dr. Rodriguez'],
    },
    {
      year: 2023,
      title: 'Gamification in Computer Science Education',
      venue: 'ACM Transactions on Computing Education',
      citations: 78,
      impact: 4.2,
      tier: 'top',
      coAuthors: ['Dr. Wilson', 'Dr. Chen', 'Dr. Taylor'],
    },
    {
      year: 2023,
      title: 'Machine Learning for Student Performance Prediction',
      venue: 'Educational Data Mining Conference',
      citations: 56,
      impact: 3.1,
      tier: 'high',
      coAuthors: ['Dr. Patel', 'Dr. Kumar'],
    },
    {
      year: 2022,
      title: 'Adaptive Learning Systems: A Comprehensive Review',
      venue: 'Computers & Education',
      citations: 124,
      impact: 5.3,
      tier: 'top',
      coAuthors: ['Dr. Wilson'],
    },
  ];

  const metrics = [
    { label: 'Total Publications', value: 82, icon: BookOpen },
    { label: 'Total Citations', value: 1847, icon: Award },
    { label: 'Average Impact Factor', value: 3.8, icon: TrendingUp },
  ];

  const yearlyData = [
    { year: '2020', publications: 12, citations: 234 },
    { year: '2021', publications: 15, citations: 389 },
    { year: '2022', publications: 18, citations: 512 },
    { year: '2023', publications: 19, citations: 678 },
    { year: '2024', publications: 18, citations: 845 },
  ];

  const venueData = [
    { type: 'Journal', count: 45 },
    { type: 'Conference', count: 28 },
    { type: 'Book Chapter', count: 6 },
    { type: 'Workshop', count: 3 },
  ];

  const coAuthors = [
    { name: 'Dr. James Wilson', publications: 12, field: 'AI in Education', color: '#00D9FF' },
    { name: 'Dr. Sarah Patel', publications: 8, field: 'Educational Technology', color: '#9D4EDD' },
    { name: 'Dr. Michael Kim', publications: 6, field: 'Data Mining', color: '#FFB703' },
    { name: 'Dr. Lisa Rodriguez', publications: 5, field: 'Learning Analytics', color: '#06A77D' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0096FF] to-[#0077BE] flex items-center justify-center">
                    <Icon size={24} className="text-white" />
                  </div>
                  <TrendingUp size={20} className="text-[#00D9FF]" />
                </div>
                <div className="text-3xl font-mono mb-1">{metric.value}</div>
                <div className="text-sm text-[#A0A0A0]">{metric.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Publication Timeline */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-xl mb-6">Recent Publications</h2>
              
              <div className="space-y-4 relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00D9FF] to-transparent"></div>

                {publications.map((pub, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative pl-16 group"
                    onMouseEnter={() => setSelectedPublication(index)}
                    onMouseLeave={() => setSelectedPublication(null)}
                  >
                    {/* Timeline bubble */}
                    <motion.div
                      className={`absolute left-0 rounded-full border-4 flex items-center justify-center cursor-pointer ${
                        pub.tier === 'top' ? 'bg-[#FFB703] border-[#FFB703]/30' : 'bg-[#00D9FF] border-[#00D9FF]/30'
                      }`}
                      style={{
                        width: `${Math.min(60, 30 + pub.citations / 3)}px`,
                        height: `${Math.min(60, 30 + pub.citations / 3)}px`,
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-xs font-mono text-[#0F1419]">{pub.citations}</span>
                    </motion.div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm">{pub.title}</h3>
                            {pub.tier === 'top' && (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFB703]/20 text-[#FFB703] text-xs">
                                Top Tier
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#A0A0A0] mb-2">{pub.venue}</p>
                          <div className="flex items-center gap-4 text-xs text-[#A0A0A0]">
                            <span>{pub.year}</span>
                            <span>IF: {pub.impact}</span>
                            <span>Citations: {pub.citations}</span>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <ExternalLink size={14} />
                        </button>
                      </div>

                      {selectedPublication === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-3 pt-3 border-t border-white/10"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Users size={14} className="text-[#A0A0A0]" />
                            <span className="text-xs text-[#A0A0A0]">Co-authors:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {pub.coAuthors.map((author, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-full bg-[#9D4EDD]/20 text-[#9D4EDD] text-xs"
                              >
                                {author}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Yearly Trend */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg mb-4">Publication Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="year" stroke="#A0A0A0" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#A0A0A0" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#16213E',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="publications"
                      stroke="#00D9FF"
                      strokeWidth={3}
                      dot={{ fill: '#00D9FF', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Venue Analysis */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg mb-4">Publications by Venue</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={venueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="type" stroke="#A0A0A0" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#A0A0A0" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#16213E',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00D9FF" />
                        <stop offset="100%" stopColor="#9D4EDD" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Co-author Network */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg mb-4">Top Collaborators</h3>
              <div className="space-y-3">
                {coAuthors.map((author, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono"
                        style={{ backgroundColor: `${author.color}30`, color: author.color }}
                      >
                        {author.name.split(' ')[1][0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{author.name}</div>
                        <div className="text-xs text-[#A0A0A0]">{author.field}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#A0A0A0]">{author.publications} publications</span>
                      {/* <button className="text-[#00D9FF] hover:underline">View profile</button> */}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommended Venues */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg mb-4">Recommended Venues</h3>
              <div className="space-y-3">
                {[
                  { name: 'Nature Education', match: 94, impact: 5.8 },
                  { name: 'ACM Learning @ Scale', match: 89, impact: 4.2 },
                  { name: 'EDUCAUSE Review', match: 85, impact: 3.9 },
                ].map((venue, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{venue.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] text-xs font-mono">
                        {venue.match}%
                      </span>
                    </div>
                    <div className="text-xs text-[#A0A0A0]">Impact Factor: {venue.impact}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}