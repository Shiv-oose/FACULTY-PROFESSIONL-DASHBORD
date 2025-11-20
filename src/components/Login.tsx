import { React, useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Shield, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginProps {
  onLoginSuccess: (role: 'faculty' | 'admin', userData: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<'faculty' | 'admin' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // RNTU Credentials
  const credentials = {
    faculty: {
      username: 'faculty@rntu.edu.in',
      password: 'RNTU@Faculty',
      displayName: 'Dr. Ayushi Mehra',
      department: 'Computer Science & Engineering'
    },
    admin: {
      username: 'admin@rntu.edu.in',
      password: 'RNTU@Admin',
      displayName: 'Dr. Sangeeta Jauhari',
      position: 'Head of Administration'
    }
  };

  const handleRoleSelect = (role: 'faculty' | 'admin') => {
    setSelectedRole(role);
    setError('');
    setUsername('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!selectedRole) {
      setError('Please select a role');
      setIsLoading(false);
      return;
    }

    const creds = credentials[selectedRole];
    if (username === creds.username && password === creds.password) {
      const userData = {
        username: creds.username,
        displayName: creds.displayName,
        ...(selectedRole === 'faculty' 
          ? { department: creds.department }
          : { position: creds.position }
        )
      };
      onLoginSuccess(selectedRole, userData);
    } else {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0F1419] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#9D4EDD]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5CC]/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl relative z-10"
      >
        {/* University Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#9D4EDD] flex items-center justify-center">
              <GraduationCap size={32} className="text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 bg-gradient-to-r from-[#00D9FF] via-[#00E5CC] to-[#9D4EDD] bg-clip-text text-transparent text-3xl font-bold"
          >
            Rabindranath Tagore University
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#A0A0A0]"
          >
            Faculty Professional Track Dashboard
          </motion.p>
        </div>

        {!selectedRole ? (
          /* Role Selection */
          <div className="grid mt-6 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => handleRoleSelect('faculty')}
              className="group cursor-pointer"
            >
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border border-white/10 hover:border-[#00D9FF]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00D9FF]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00E5CC]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <GraduationCap size={40} className="text-[#00D9FF]" />
                  </div>
                  
                  <h2 className="text-2xl mb-3 text-[#F0F0F0]">Login as Faculty</h2>
                  <p className="text-[#A0A0A0] mb-6">
                    Access your professional development dashboard, track publications, skills, and career growth
                  </p>
                  
                  <div className="flex items-center gap-2 text-[#00D9FF]">
                    <span>Continue as Faculty</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => handleRoleSelect('admin')}
              className="group cursor-pointer"
            >
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border border-white/10 hover:border-[#9D4EDD]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#9D4EDD]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9D4EDD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#9D4EDD]/20 to-[#FF006E]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Shield size={40} className="text-[#9D4EDD]" />
                  </div>
                  
                  <h2 className="text-2xl mb-3 text-[#F0F0F0]">Login as Admin</h2>
                  <p className="text-[#A0A0A0] mb-6">
                    Manage faculty members, review analytics, approve FDP enrollments, and oversee institutional progress
                  </p>
                  
                  <div className="flex items-center gap-2 text-[#9D4EDD]">
                    <span>Continue as Admin</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Login Form */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border border-white/10">
              {/* Role Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${
                  selectedRole === 'faculty' 
                    ? 'from-[#00D9FF]/20 to-[#00E5CC]/20' 
                    : 'from-[#9D4EDD]/20 to-[#FF006E]/20'
                } flex items-center justify-center mb-4`}>
                  {selectedRole === 'faculty' ? (
                    <GraduationCap size={32} className="text-[#00D9FF]" />
                  ) : (
                    <Shield size={32} className="text-[#9D4EDD]" />
                  )}
                </div>
                <h2 className="text-2xl mb-2 text-[#F0F0F0]">
                  {selectedRole === 'faculty' ? 'Faculty Login' : 'Admin Login'}
                </h2>
                <p className="text-sm text-[#A0A0A0]">
                  Rabindranath Tagore University
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[#F0F0F0]">
                    Email / Username
                  </Label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0]" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={`Enter your ${selectedRole} email`}
                      className="pl-10 bg-white/5 border-white/10 text-[#F0F0F0] placeholder:text-[#A0A0A0]/50 focus:border-[#00D9FF] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#F0F0F0]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0]" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 bg-white/5 border-white/10 text-[#F0F0F0] placeholder:text-[#A0A0A0]/50 focus:border-[#00D9FF] transition-colors"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
                  >
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-12 ${
                      selectedRole === 'faculty'
                        ? 'bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] hover:from-[#00C4EA] hover:to-[#00D4BB]'
                        : 'bg-gradient-to-r from-[#9D4EDD] to-[#FF006E] hover:from-[#8B3DCD] hover:to-[#EA005E]'
                    } text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100`}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleBackToRoles}
                    variant="ghost"
                    className="w-full h-12 text-[#A0A0A0] hover:text-[#F0F0F0] hover:bg-white/5"
                  >
                    ← Back to Role Selection
                  </Button>
                </div>
              </form>

              {/* Remove demo credentials hint - removed as per request */}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-[#A0A0A0]"
        >
          <p>© 2025 Rabindranath Tagore University. All rights reserved.</p>
          <p className="mt-1">Empowering Faculty Excellence Through Technology</p>
        </motion.div>
      </motion.div>
    </div>
  );
}