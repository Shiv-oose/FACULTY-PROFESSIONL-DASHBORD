import { React, useState } from 'react';
import { Users, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';

const sampleFacultyData = [
  {
    name: 'Dr. Aditya Malhotra',
    email: 'aditya.malhotra@rntu.edu.in',
    department: 'Computer Science & Engineering',
    position: 'Associate Professor',
    joiningDate: '2018-07-15',
  },
  {
    name: 'Prof. Kavita Nair',
    email: 'kavita.nair@rntu.edu.in',
    department: 'Electronics & Communication',
    position: 'Professor',
    joiningDate: '2015-08-20',
  },
  {
    name: 'Dr. Sanjay Verma',
    email: 'sanjay.verma@rntu.edu.in',
    department: 'Mathematics',
    position: 'Assistant Professor',
    joiningDate: '2020-01-10',
  },
  {
    name: 'Dr. Meera Reddy',
    email: 'meera.reddy@rntu.edu.in',
    department: 'Physics',
    position: 'Associate Professor',
    joiningDate: '2017-03-25',
  },
  {
    name: 'Prof. Arjun Kapoor',
    email: 'arjun.kapoor@rntu.edu.in',
    department: 'Management Studies',
    position: 'Senior Professor',
    joiningDate: '2012-09-01',
  },
];

interface SampleFacultySeederProps {
  onComplete: () => void;
}

export default function SampleFacultySeeder({ onComplete }: SampleFacultySeederProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateUsername = (email: string) => {
    return email; // Already in correct format
  };

  const generatePassword = (name: string) => {
    // Generate password from first name: RNTU@FirstName2024
    const firstName = name.split(' ')[1] || name.split(' ')[0];
    return `RNTU@${firstName}2024`;
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setProgress(0);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < sampleFacultyData.length; i++) {
      const faculty = sampleFacultyData[i];
      
      try {
        const username = generateUsername(faculty.email);
        const password = generatePassword(faculty.name);

        const response = await apiRequest('/faculty/create', {
          method: 'POST',
          body: JSON.stringify({
            ...faculty,
            username,
            password,
          }),
        });

        if (response.success) {
          successCount++;
        } else {
          failCount++;
          console.error(`Failed to add ${faculty.name}:`, response.error);
        }
      } catch (error) {
        failCount++;
        console.error(`Error adding ${faculty.name}:`, error);
      }

      setProgress(((i + 1) / sampleFacultyData.length) * 100);
      
      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsSeeding(false);

    if (successCount > 0) {
      toast.success(`Successfully added ${successCount} faculty members!`);
      setIsOpen(false);
      onComplete();
    }
    
    if (failCount > 0) {
      toast.error(`${failCount} faculty members could not be added (may already exist)`);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="bg-white/5 border-white/10 hover:bg-white/10 text-[#F0F0F0]"
      >
        <Database size={18} className="mr-2" />
        Add Sample Faculty
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#16213E] border-white/10 text-[#F0F0F0]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Users size={20} className="text-[#00D9FF]" />
              Add Sample Faculty Data
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-[#A0A0A0]">
              This will add {sampleFacultyData.length} sample faculty members to the system with the following details:
            </p>

            <div className="max-h-64 overflow-y-auto space-y-2 p-3 rounded-lg bg-white/5 border border-white/10">
              {sampleFacultyData.map((faculty, index) => (
                <div key={index} className="p-2 rounded bg-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{faculty.name}</p>
                      <p className="text-xs text-[#A0A0A0]">{faculty.position}</p>
                    </div>
                    <span className="text-xs text-[#00D9FF]">{faculty.department}</span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] mt-1">{faculty.email}</p>
                </div>
              ))}
            </div>

            {isSeeding && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A0A0A0]">Adding faculty members...</span>
                  <span className="text-[#00D9FF]">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSeedData}
                disabled={isSeeding}
                className="flex-1 bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-[#0F1419] hover:shadow-lg disabled:opacity-50"
              >
                {isSeeding ? 'Adding...' : 'Add Faculty Members'}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                disabled={isSeeding}
                variant="ghost"
                className="flex-1 bg-white/5 hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-[#A0A0A0] mt-2">
              Note: Credentials will be auto-generated. Email notifications will be sent if configured.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
