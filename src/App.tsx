import { React, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BookOpen, Award, Calendar, Target, Menu, X, LogOut, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Toaster } from 'react-hot-toast';
import DashboardHome from './components/DashboardHome';
import SkillsVisualization from './components/SkillsVisualization';
import PublicationsDashboard from './components/PublicationsDashboard';
import FDPCalendar from './components/FDPCalendar';
import CareerRoadmap from './components/CareerRoadmap';
import DemoDataInitializer from './components/DemoDataInitializer';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import FacultyManagement from './components/FacultyManagement';
import { Button } from './components/ui/button';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInitializer, setShowInitializer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'faculty' | 'admin' | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLoginSuccess = (role: 'faculty' | 'admin', user: any) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserData(user);
    // Only show initializer for faculty
    setShowInitializer(role === 'faculty');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
    setActiveView('home');
    setSidebarOpen(false);
    setIsLogoutDialogOpen(false);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Admin specific navigation
  const adminNavItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'publications', label: 'Publications', icon: BookOpen },
    { id: 'fdp', label: 'FDP Programs', icon: Calendar },
    // { id: 'analytics', label: 'Analytics', icon: Target },
  ];

  // Faculty navigation
  const facultyNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'publications', label: 'Publications', icon: BookOpen },
    { id: 'fdp', label: 'FDP', icon: Calendar },
    { id: 'goals', label: 'Career', icon: Target },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : facultyNavItems;

  const renderView = () => {
    // Admin views
    if (userRole === 'admin') {
      switch (activeView) {
        case 'home':
          return <AdminDashboard />;
        case 'faculty':
          return <FacultyManagement />; // Will be replaced with FacultyManagement component later
        case 'publications':
          return <PublicationsDashboard />;
        case 'fdp':
          return <FDPCalendar />;// Will be replaced with Analytics component later
        // default:
        //   return <AdminDashboard />;
      }
    }

    // Faculty views
    switch (activeView) {
      case 'home':
        return <DashboardHome onNavigate={setActiveView} />;
      case 'skills':
        return <SkillsVisualization />;
      case 'publications':
        return <PublicationsDashboard />;
      case 'fdp':
        return <FDPCalendar />;
      case 'goals':
        return <CareerRoadmap />;
      default:
        return <DashboardHome onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1419] text-[#F0F0F0]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0F1419]/80 border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                userRole === 'faculty' 
                  ? 'from-[#00D9FF] to-[#00E5CC]' 
                  : 'from-[#9D4EDD] to-[#FF006E]'
              } flex items-center justify-center`}>
                <span className="font-mono">{userRole === 'faculty' ? 'FT' : 'AD'}</span>
              </div>
              <div>
                <h1 className="text-lg">Faculty Pro Track</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-[#A0A0A0]">{userData?.displayName || 'User'}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    userRole === 'faculty' 
                      ? 'bg-[#00D9FF]/20 text-[#00D9FF]' 
                      : 'bg-[#9D4EDD]/20 text-[#9D4EDD]'
                  }`}>
                    {userRole === 'faculty' ? 'Faculty' : 'Admin'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-center">
                <div className="text-sm text-[#00D9FF]">82</div>
                <div className="text-xs text-[#A0A0A0]">Publications</div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center">
                <div className="text-sm text-[#FFB703]">12</div>
                <div className="text-xs text-[#A0A0A0]">FDPs</div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center">
                <div className="text-sm text-[#9D4EDD]">8</div>
                <div className="text-xs text-[#A0A0A0]">Skills</div>
              </div>
            </div>
            <button
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 text-[#A0A0A0] hover:text-[#F0F0F0]"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-[72px]">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="fixed lg:sticky top-[72px] left-0 h-[calc(100vh-72px)] w-20 bg-[#16213E]/50 backdrop-blur-xl border-r border-white/10 z-40"
            >
              <nav className="flex flex-col items-center gap-2 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-br from-[#00D9FF] to-[#00E5CC] text-[#0F1419]'
                          : 'text-[#A0A0A0] hover:text-[#F0F0F0] hover:bg-white/5'
                      }`}
                    >
                      <Icon size={20} />
                      <div className="absolute left-full ml-4 px-3 py-1 bg-[#16213E] border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
                <button
                  onClick={() => setIsLogoutDialogOpen(true)}
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group text-[#A0A0A0] hover:text-[#F0F0F0] hover:bg-white/5"
                >
                  <LogOut size={20} />
                  <div className="absolute left-full ml-4 px-3 py-1 bg-[#16213E] border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                    Logout
                  </div>
                </button>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-72px)] lg:ml-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Demo Data Initializer */}
      {showInitializer && (
        <DemoDataInitializer onClose={() => setShowInitializer(false)} />
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="bg-[#16213E] border-white/10 text-[#F0F0F0] max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-2xl mb-2 text-[#FF006E]">Confirm Logout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-[#A0A0A0]">
              Are you sure you want to end your session and log out?
            </p>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleLogout} className="flex-1 bg-[#FF006E] hover:bg-[#EA005E] text-white text-1xl">
                Yes
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsLogoutDialogOpen(false)} className="text-[#A0A0A0] hover:text-[#F0F0F0] hover:bg-white/5 text-1xl">
                No
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#16213E',
            color: '#F0F0F0',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </div>
  );
}