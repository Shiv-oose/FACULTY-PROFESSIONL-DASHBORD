import { React, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Plus, Mail, Search, Edit2, Trash2, UserCheck, BookOpen, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import toast from 'react-hot-toast';
import { apiClient, apiRequest } from '../utils/api';
import SampleFacultySeeder from './SampleFacultySeeder';

interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joiningDate: string;
  username: string;
  publications: number;
  fdps: number;
  hIndex: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function FacultyManagement() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingFaculty, setDeletingFaculty] = useState<Faculty | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    email: '',
    department: '',
    position: '',
    joiningDate: '',
  });

  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('/faculty/list');
      if (response.faculties) {
        setFaculties(response.faculties);
      }
    } catch (error) {
      console.error('Error loading faculties:', error);
      toast.error('Failed to load faculty members');
    } finally {
      setIsLoading(false);
    }
  };

  const generateUsername = (name: string) => {
    // Convert name to username format: "Dr. Priya Sharma" -> "priya.sharma@rntu.edu.in"
    const cleanName = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').trim();
    const parts = cleanName.toLowerCase().split(' ');
    const username = parts.join('.') + '@rntu.edu.in';
    return username;
  };

  const generatePassword = () => {
    // Generate a secure password: RNTU@FirstName123
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomChars = Array.from({ length: 3 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    return `RNTU@${randomChars}${Math.floor(Math.random() * 900 + 100)}`;
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.department || !formData.position) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSendingEmail(true);

    try {
      const username = generateUsername(formData.name);
      const password = generatePassword();

      // Create faculty member
      const response = await apiRequest('/faculty/create', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          username,
          password,
        }),
      });

      if (response.success) {
        toast.success('Faculty member added successfully!');
        
        // Send email notification
        if (response.emailSent) {
          toast.success(`Credentials sent to ${formData.email}`);
        } else {
          toast.error('Faculty added but email notification failed');
        }

        // Reset form and reload list
        setFormData({
          name: '',
          email: '',
          department: '',
          position: '',
          joiningDate: new Date().toISOString().split('T')[0],
        });
        setIsAddDialogOpen(false);
        loadFaculties();
      } else {
        toast.error(response.error || 'Failed to add faculty member');
      }
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast.error('Failed to add faculty member');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDeleteClick = (faculty: Faculty) => {
    setDeletingFaculty(faculty);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingFaculty) return;

    try {
      const response = await apiRequest(`/faculty/delete/${deletingFaculty.id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        toast.success('Faculty member removed successfully');
        loadFaculties();
        setIsDeleteDialogOpen(false);
        setDeletingFaculty(null);
      } else {
        toast.error('Failed to remove faculty member');
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to remove faculty member');
    }
  };

  const handleEditClick = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setEditFormData({
      id: faculty.id,
      name: faculty.name,
      email: faculty.email,
      department: faculty.department,
      position: faculty.position,
      joiningDate: faculty.joiningDate.split('T')[0],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;

    setIsUpdating(true);
    const updateData = { ...editFormData };

    try {
      const response = await apiRequest(`/faculty/update/${editingFaculty.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...updateData,
          joiningDate: new Date(updateData.joiningDate).toISOString(),
        }),
      });
      if (response.success) {
        toast.success('Faculty member updated successfully');
        setIsEditDialogOpen(false);
        setEditingFaculty(null);
        loadFaculties();
      } else {
        toast.error(response.error || 'Failed to update faculty member');
      }
    } catch (error) {
      console.error('Error updating faculty:', error);
      toast.error('Failed to update faculty member');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResendCredentials = async (faculty: Faculty) => {
    try {
      setIsSendingEmail(true);
      const response = await apiRequest('/faculty/resend-credentials', {
        method: 'POST',
        body: JSON.stringify({ facultyId: faculty.id }),
      });

      if (response.success) {
        toast.success(`Credentials resent to ${faculty.email}`);
      } else {
        toast.error('Failed to resend credentials');
      }
    } catch (error) {
      console.error('Error resending credentials:', error);
      toast.error('Failed to resend credentials');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const filteredFaculties = faculties.filter(faculty =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faculty.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Management Studies',
    'English',
    'Other'
  ];

  const positions = [
    'Assistant Professor',
    'Associate Professor',
    'Professor',
    'Senior Professor',
    'Visiting Faculty',
    'Guest Lecturer'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Faculty Management</h1>
          <p className="text-[#A0A0A0]">Add, view, and manage faculty members</p>
        </div>

        <div className="flex gap-2">
          <SampleFacultySeeder onComplete={loadFaculties} />
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] hover:from-[#00C4EA] hover:to-[#00D4BB] text-white">
                <Plus size={18} className="mr-2" />
                Add Faculty
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#16213E] border-white/10 text-[#F0F0F0] max-w-2xl" aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle className="text-2xl mb-2">Add New Faculty Member</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddFaculty} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Priya Sharma"
                      className="bg-white/5 border-white/10 text-[#F0F0F0]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya.sharma@gmail.com"
                      className="bg-white/5 border-white/10 text-[#F0F0F0]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                      required
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-[#F0F0F0]">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#16213E] border-white/10 text-[#F0F0F0]">
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => setFormData({ ...formData, position: value })}
                      required
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-[#F0F0F0]">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#16213E] border-white/10 text-[#F0F0F0]">
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joiningDate">Joining Date *</Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-[#F0F0F0]"
                    required
                  />
                </div>

                {/* <div className="p-4 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/20">
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-[#00D9FF] mt-0.5" />
                    <div className="text-sm">
                      <p className="text-[#F0F0F0] mb-1">Email Notification</p>
                      <p className="text-[#A0A0A0]">
                        Login credentials will be automatically generated and sent to the provided email address.
                      </p>
                    </div>
                  </div>
                </div> */}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSendingEmail}
                    className="flex-1 bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] hover:from-[#00C4EA] hover:to-[#00D4BB] text-white"
                  >
                    {isSendingEmail ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Adding Faculty...
                      </>
                    ) : (
                      <>
                        <Plus size={18} className="mr-2" />
                        Add Faculty
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="text-[#A0A0A0] hover:text-[#F0F0F0] hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00E5CC]/20 flex items-center justify-center">
              <Users size={24} className="text-[#00D9FF]" />
            </div>
            <div>
              <div className="text-2xl text-[#00D9FF]">{faculties.length}</div>
              <div className="text-sm text-[#A0A0A0]">Total Faculty</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06D6A0]/20 to-[#06D6A0]/20 flex items-center justify-center">
              <UserCheck size={24} className="text-[#06D6A0]" />
            </div>
            <div>
              <div className="text-2xl text-[#06D6A0]">
                {faculties.filter(f => f.status === 'active').length}
              </div>
              <div className="text-sm text-[#A0A0A0]">Active</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0096FF]/20 to-[#0096FF]/20 flex items-center justify-center">
              <BookOpen size={24} className="text-[#0096FF]" />
            </div>
            <div>
              <div className="text-2xl text-[#0096FF]">
                {faculties.reduce((sum, f) => sum + f.publications, 0)}
              </div>
              <div className="text-sm text-[#A0A0A0]">Publications</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9D4EDD]/20 to-[#9D4EDD]/20 flex items-center justify-center">
              <Award size={24} className="text-[#9D4EDD]" />
            </div>
            <div>
              <div className="text-2xl text-[#9D4EDD]">
                {faculties.reduce((sum, f) => sum + f.fdps, 0)}
              </div>
              <div className="text-sm text-[#A0A0A0]">FDPs Completed</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0]" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, department, or email..."
          className="pl-10 bg-white/5 border-white/10 text-[#F0F0F0]"
        />
      </div>

      {/* Faculty List */}
      <Card className="p-6 bg-gradient-to-br from-[#16213E]/80 to-[#0F1419]/80 backdrop-blur-xl border-white/10">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#00D9FF]/20 border-t-[#00D9FF] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#A0A0A0]">Loading faculty members...</p>
          </div>
        ) : filteredFaculties.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="text-[#A0A0A0] mx-auto mb-4" />
            <p className="text-[#A0A0A0]">
              {searchQuery ? 'No faculty members found' : 'No faculty members yet. Add your first faculty member!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaculties.map((faculty) => (
              <motion.div
                key={faculty.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D9FF]/20 to-[#00E5CC]/20 flex items-center justify-center">
                      <span className="text-lg">{faculty.name.charAt(0)}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[#F0F0F0]">{faculty.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          faculty.status === 'active' 
                            ? 'bg-[#06D6A0]/20 text-[#06D6A0]' 
                            : 'bg-[#A0A0A0]/20 text-[#A0A0A0]'
                        }`}>
                          {faculty.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#A0A0A0]">
                        <span>{faculty.position}</span>
                        <span>•</span>
                        <span>{faculty.department}</span>
                        <span>•</span>
                        <span>{faculty.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg text-[#0096FF]">{faculty.publications}</div>
                        <div className="text-xs text-[#A0A0A0]">Pubs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg text-[#FFB703]">{faculty.hIndex}</div>
                        <div className="text-xs text-[#A0A0A0]">H-Index</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg text-[#9D4EDD]">{faculty.fdps}</div>
                        <div className="text-xs text-[#A0A0A0]">FDPs</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {/* <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleResendCredentials(faculty)}
                      disabled={isSendingEmail}
                      className="text-[#00D9FF] hover:bg-[#00D9FF]/10"
                      title="Resend credentials via email"
                    >
                      <Mail size={16} />
                    </Button> */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#A0A0A0] hover:bg-white/5"
                      title="Edit Faculty"
                      onClick={() => handleEditClick(faculty)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(faculty)}
                      className="text-[#FF006E] hover:bg-[#FF006E]/10"
                      title="Delete faculty"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#16213E] border-white/10 text-[#F0F0F0] max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-2xl mb-2">Edit Faculty Member</DialogTitle>
            <p className="text-sm text-[#A0A0A0]">
              Update details for {editingFaculty?.name}.
            </p>
          </DialogHeader>

          <form onSubmit={handleUpdateFaculty} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-[#F0F0F0]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-[#F0F0F0]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Select
                  value={editFormData.department}
                  onValueChange={(value) => setEditFormData({ ...editFormData, department: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-[#F0F0F0]">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#16213E] border-white/10 text-[#F0F0F0]">
                    {departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-position">Position *</Label>
                <Select
                  value={editFormData.position}
                  onValueChange={(value) => setEditFormData({ ...editFormData, position: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-[#F0F0F0]">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#16213E] border-white/10 text-[#F0F0F0]">
                    {positions.map((pos) => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-joiningDate">Joining Date *</Label>
              <Input
                id="edit-joiningDate"
                type="date"
                value={editFormData.joiningDate}
                onChange={(e) => setEditFormData({ ...editFormData, joiningDate: e.target.value })}
                className="bg-white/5 border-white/10 text-[#F0F0F0]"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-white"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="text-[#A0A0A0] hover:text-[#F0F0F0] hover:bg-white/5">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#16213E] border-white/10 text-[#F0F0F0] max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-2xl mb-2 text-[#FF006E]">Confirm Deletion</DialogTitle>
          </DialogHeader>
          {deletingFaculty && (
            <div className="space-y-4 mt-4">
              <p className="text-[#A0A0A0]">
                Are you sure you want to permanently delete{' '}
                <span className="font-bold text-[#F0F0F0]">{deletingFaculty.name}</span>?
              </p>
              <p className="text-sm text-[#A0A0A0]">
                This action cannot be undone. All data associated with this faculty member will be removed.
              </p>
              <div className="flex gap-3 pt-4">
                <Button onClick={confirmDelete} className="flex-1 bg-[#FF006E] hover:bg-[#EA005E] text-white">
                  Yes
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="text-[#A0A0A0] hover:text-[#F0F0F0] hover:bg-white/5">
                  No
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}