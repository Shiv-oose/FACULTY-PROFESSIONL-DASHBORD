import { React, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import toast from 'react-hot-toast';
import { apiClient } from '../utils/api';
import { Award, Save, X } from 'lucide-react';

interface Skill {
  skill: string;
  current: number;
  target: number;
}

interface UpdateSkillsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export default function UpdateSkillsDialog({ isOpen, onOpenChange, onSuccess }: UpdateSkillsDialogProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchSkills = async () => {
        setIsLoading(true);
        try {
          const data = await apiClient.getSkills();
          setSkills(data);
        } catch (error) {
          toast.error('Failed to load skills.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchSkills();
    }
  }, [isOpen]);

  const handleSkillChange = (index: number, value: number) => {
    const updatedSkills = [...skills];
    updatedSkills[index].current = value;
    setSkills(updatedSkills);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiClient.updateSkills(skills);
      if (response.success) {
        toast.success('Skills updated successfully!');
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error('Failed to update skills.');
      }
    } catch (error) {
      toast.error('An error occurred while updating skills.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#16213E] border-white/10 text-[#F0F0F0] max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl mb-2 flex items-center gap-2">
            <Award size={24} className="text-[#00D9FF]" />
            Update Your Skills
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {isLoading ? (
            <div className="text-center p-8">Loading skills...</div>
          ) : (
            skills.map((skill, index) => (
              <div key={skill.skill} className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`skill-${index}`} className="text-1xl">{skill.skill}</Label>
                <div className="slider-wrapper width-40%">
                  <div 
                    className="slider-progress" 
                    style={{ width: `${skill.current}%` }}
                  />
                  <input
                    id={`skill-${index}`}
                    type="range"
                    min="0"
                    max="100"
                    value={skill.current}
                    onChange={(e) => handleSkillChange(index, parseInt(e.target.value))}
                    className="custom-slider"
                  />
                </div>
                  <span className="text-lg font-mono text-[#00D9FF]">{skill.current}</span>
                </div>
              </div>
            ))
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting || isLoading} className="flex-1 bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-[#0F1419] hover:shadow-lg">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-[#A0A0A0] hover:text-[#F0F0F0] hover:bg-white/5">
              <X size={16} className="mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}