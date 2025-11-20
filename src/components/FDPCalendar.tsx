import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ExternalLink, Award, CheckCircle, Plus, X, Save } from 'lucide-react';
import { React, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import toast from 'react-hot-toast';

interface FDPEvent {
  id: string;
  title: string;
  category: string;
  duration: string;
  dates: string;
  location: string;
  participants: number;
  match?: number;
  color: string;
  registrationDeadline?: string;
  urgent?: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface CompletedFDP {
  title: string;
  category: string;
  completedDate: string;
  duration: string;
  certificate: boolean;
  skills: string[];
  color: string;
}

export default function FDPCalendar() {
  const [view, setView] = useState<'upcoming' | 'completed'>('upcoming');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentMonth] = useState(new Date(2025, 0, 1)); // January 2025

  // Form state for new event
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Leadership',
    duration: '',
    location: 'Online',
    participants: '',
    startDate: '',
    endDate: '',
  });

  const [upcomingFDPs, setUpcomingFDPs] = useState<FDPEvent[]>([
    {
      id: '1',
      title: 'Academic Leadership Excellence',
      category: 'Leadership',
      duration: '5 days',
      dates: 'Jan 15-20, 2025',
      location: 'Online',
      participants: 45,
      match: 94,
      color: '#00D9FF',
      registrationDeadline: '5 days left',
      urgent: true,
      startDate: new Date(2025, 0, 15),
      endDate: new Date(2025, 0, 20),
    },
    {
      id: '2',
      title: 'Digital Transformation in Education',
      category: 'Technology',
      duration: '3 days',
      dates: 'Feb 5-8, 2025',
      location: 'Hybrid',
      participants: 60,
      match: 88,
      color: '#9D4EDD',
      registrationDeadline: '2 weeks left',
      urgent: false,
      startDate: new Date(2025, 1, 5),
      endDate: new Date(2025, 1, 8),
    },
    {
      id: '3',
      title: 'Research Grant Writing Workshop',
      category: 'Research',
      duration: '2 days',
      dates: 'Feb 20-21, 2025',
      location: 'In-person',
      participants: 30,
      match: 85,
      color: '#FFB703',
      registrationDeadline: '3 weeks left',
      urgent: false,
      startDate: new Date(2025, 1, 20),
      endDate: new Date(2025, 1, 21),
    },
    {
      id: '4',
      title: 'Innovative Teaching Methodologies',
      category: 'Teaching',
      duration: '4 days',
      dates: 'Mar 10-14, 2025',
      location: 'Online',
      participants: 80,
      match: 82,
      color: '#06A77D',
      registrationDeadline: '1 month left',
      urgent: false,
      startDate: new Date(2025, 2, 10),
      endDate: new Date(2025, 2, 14),
    },
  ]);

  const completedFDPs: CompletedFDP[] = [
    {
      title: 'Advanced Research Methodology',
      category: 'Research',
      completedDate: 'Nov 2024',
      duration: '3 days',
      certificate: true,
      skills: ['Research Design', 'Data Analysis', 'Statistical Methods'],
      color: '#0096FF',
    },
    {
      title: 'Effective Classroom Management',
      category: 'Teaching',
      completedDate: 'Oct 2024',
      duration: '2 days',
      certificate: true,
      skills: ['Student Engagement', 'Classroom Dynamics'],
      color: '#06A77D',
    },
    {
      title: 'Academic Writing Excellence',
      category: 'Communication',
      completedDate: 'Sep 2024',
      duration: '4 days',
      certificate: true,
      skills: ['Technical Writing', 'Paper Structure', 'Peer Review'],
      color: '#FFB703',
    },
  ];

  const categoryColors: Record<string, string> = {
    Leadership: '#00D9FF',
    Technology: '#9D4EDD',
    Research: '#FFB703',
    Teaching: '#06A77D',
    Communication: '#0096FF',
  };

  const handleDateClick = (date: number) => {
    setSelectedDate(date);
    setShowAddDialog(true);
    // Pre-fill the start date
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(date).padStart(2, '0');
    setNewEvent(prev => ({ ...prev, startDate: `${year}-${month}-${day}` }));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const startDate = new Date(newEvent.startDate);
    const endDate = new Date(newEvent.endDate);
    
    if (endDate < startDate) {
      toast.error('End date must be after start date');
      return;
    }

    const color = categoryColors[newEvent.category] || '#00D9FF';
    
    const fdpEvent: FDPEvent = {
      id: crypto.randomUUID(),
      title: newEvent.title,
      category: newEvent.category,
      duration: newEvent.duration,
      dates: `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      location: newEvent.location,
      participants: parseInt(newEvent.participants) || 0,
      match: Math.floor(Math.random() * 20) + 80,
      color,
      registrationDeadline: 'Open for registration',
      urgent: false,
      startDate,
      endDate,
    };

    setUpcomingFDPs(prev => [...prev, fdpEvent]);
    toast.success('Event added successfully!');
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setSelectedDate(null);
    setNewEvent({
      title: '',
      category: 'Leadership',
      duration: '',
      location: 'Online',
      participants: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleRegister = (fdpId: string) => {
    toast.success('Successfully registered for the FDP!');
  };

  const handleViewDetails = (fdpId: string) => {
    toast('Opening FDP details...');
  };

  // Generate calendar data
  const getEventsForDate = (date: number) => {
    return upcomingFDPs.filter(fdp => {
      if (!fdp.startDate || !fdp.endDate) return false;
      const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
      return checkDate >= fdp.startDate && checkDate <= fdp.endDate;
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* View Toggle */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between"
          >
            <div className="flex gap-2">
              <button
                onClick={() => setView('upcoming')}
                className={`px-6 py-2 rounded-xl transition-all duration-200 ${
                  view === 'upcoming'
                    ? 'bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-[#0F1419]'
                    : 'bg-white/5 text-[#A0A0A0] hover:bg-white/10'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setView('completed')}
                className={`px-6 py-2 rounded-xl transition-all duration-200 ${
                  view === 'completed'
                    ? 'bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-[#0F1419]'
                    : 'bg-white/5 text-[#A0A0A0] hover:bg-white/10'
                }`}
              >
                Completed
              </button>
            </div>
          </motion.div>

          {/* Upcoming FDPs */}
          {view === 'upcoming' && (
            <div className="space-y-4">
              {upcomingFDPs.map((fdp, index) => (
                <motion.div
                  key={fdp.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#16213E]/50 backdrop-blur-xl hover:border-white/20 transition-all duration-200 group"
                >
                  {/* Urgent indicator */}
                  {fdp.urgent && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#FFA500] text-[#0F1419] text-xs rounded-bl-xl">
                      Registration closing soon
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${fdp.color}20` }}
                          >
                            <CalendarIcon size={24} style={{ color: fdp.color }} />
                          </div>
                          <div>
                            <h3 className="text-lg mb-1">{fdp.title}</h3>
                            <div className="flex items-center gap-2">
                              <span
                                className="px-2 py-0.5 rounded-full text-xs"
                                style={{
                                  backgroundColor: `${fdp.color}20`,
                                  color: fdp.color,
                                }}
                              >
                                {fdp.category}
                              </span>
                              {fdp.match && (
                                <span className="px-2 py-0.5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] text-xs font-mono">
                                  {fdp.match}% match
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                        <CalendarIcon size={16} />
                        <span>{fdp.dates}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                        <Clock size={16} />
                        <span>{fdp.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                        <MapPin size={16} />
                        <span>{fdp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                        <Users size={16} />
                        <span>{fdp.participants} participants</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-sm text-[#A0A0A0]">{fdp.registrationDeadline}</span>
                      <div className="flex gap-2">
                        {/* <button 
                          onClick={() => handleViewDetails(fdp.id)}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <ExternalLink size={14} />
                          Details
                        </button> */}
                        <button 
                          onClick={() => handleRegister(fdp.id)}
                          className="px-4 py-2 bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-[#0F1419] rounded-lg hover:shadow-lg hover:shadow-[#00D9FF]/20 transition-all duration-200"
                        >
                          Register Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Animated border on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${fdp.color} 0%, transparent 100%)`,
                    }}
                  ></div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Completed FDPs */}
          {view === 'completed' && (
            <div className="space-y-4">
              {completedFDPs.map((fdp, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-[#16213E]/50 backdrop-blur-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${fdp.color}20` }}
                      >
                        <CheckCircle size={24} style={{ color: fdp.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg mb-1">{fdp.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs"
                            style={{
                              backgroundColor: `${fdp.color}20`,
                              color: fdp.color,
                            }}
                          >
                            {fdp.category}
                          </span>
                          {fdp.certificate && (
                            <span className="px-2 py-0.5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] text-xs flex items-center gap-1">
                              <Award size={12} />
                              Certified
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-[#A0A0A0]">
                          Completed: {fdp.completedDate} • Duration: {fdp.duration}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pl-15">
                    <div className="mb-2 text-sm text-[#A0A0A0]">Skills Gained:</div>
                    <div className="flex flex-wrap gap-2">
                      {fdp.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-white/5 text-sm border border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">January 2025</h3>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="h-8 px-3 bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-[#0F1419] hover:shadow-lg transition-all"
              >
                <Plus size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="text-center text-xs text-[#A0A0A0]">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
                const events = getEventsForDate(date);
                const hasEvent = events.length > 0;
                return (
                  <button
                    key={date}
                    onClick={() => handleDateClick(date)}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all cursor-pointer ${
                      hasEvent
                        ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 hover:bg-[#00D9FF]/30'
                        : 'text-[#A0A0A0] hover:bg-white/5'
                    }`}
                  >
                    {date}
                  </button>
                );
              })}
            </div>

            {upcomingFDPs.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-[#A0A0A0] mb-1">Next Upcoming</div>
                <div className="text-sm">{upcomingFDPs[0].title}</div>
                <div className="text-xs text-[#00D9FF]">{upcomingFDPs[0].dates}</div>
              </div>
            )}
          </motion.div>

          {/* FDP Stats */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg mb-4">Your FDP Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">Total Completed</span>
                <span className="text-2xl font-mono">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">Total Hours</span>
                <span className="text-2xl font-mono">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">Certificates</span>
                <span className="text-2xl font-mono">10</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="text-sm text-[#A0A0A0] mb-2">Learning Streak</div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl">🔥</div>
                  <div>
                    <div className="text-2xl font-mono">5</div>
                    <div className="text-xs text-[#A0A0A0]">months</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-[#16213E]/50 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg mb-4">FDPs by Category</h3>
            <div className="space-y-3">
              {[
                { category: 'Research', count: 4, color: '#0096FF' },
                { category: 'Teaching', count: 3, color: '#06A77D' },
                { category: 'Leadership', count: 2, color: '#00D9FF' },
                { category: 'Technology', count: 2, color: '#9D4EDD' },
                { category: 'Communication', count: 1, color: '#FFB703' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A0A0A0]">{item.category}</span>
                    <span className="font-mono">{item.count}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / 12) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#16213E] border-white/10 text-[#F0F0F0] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Plus size={20} className="text-[#00D9FF]" />
              Add New FDP Event
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Advanced Machine Learning Workshop"
                className="bg-white/5 border-white/10 text-[#F0F0F0]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={newEvent.category} onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-[#F0F0F0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#16213E] border-white/10">
                  <SelectItem value="Leadership">Leadership</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Teaching">Teaching</SelectItem>
                  <SelectItem value="Communication">Communication</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                  className="bg-white/5 border-white/10 text-[#F0F0F0]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                  className="bg-white/5 border-white/10 text-[#F0F0F0]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={newEvent.duration}
                onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                placeholder="e.g., 3 days"
                className="bg-white/5 border-white/10 text-[#F0F0F0]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select value={newEvent.location} onValueChange={(value) => setNewEvent({ ...newEvent, location: value })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-[#F0F0F0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#16213E] border-white/10">
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="In-person">In-person</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Expected Participants</Label>
              <Input
                id="participants"
                type="number"
                value={newEvent.participants}
                onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                placeholder="e.g., 50"
                className="bg-white/5 border-white/10 text-[#F0F0F0]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddEvent}
                className="flex-1 bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-[#0F1419] hover:shadow-lg"
              >
                <Save size={16} className="mr-2" />
                Save Event
              </Button>
              <Button
                onClick={handleCloseDialog}
                variant="ghost"
                className="flex-1 bg-white/5 hover:bg-white/10"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
