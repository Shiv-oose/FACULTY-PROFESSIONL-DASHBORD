import { React, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import toast from 'react-hot-toast';
import { apiClient } from '../utils/api';
import { BookOpen, Save, X } from 'lucide-react';

interface AddPublicationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export default function AddPublicationDialog({ isOpen, onOpenChange, onSuccess }: AddPublicationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    year: new Date().getFullYear(),
    citations: 0,
    impact: 0,
    tier: 'high',
    coAuthors: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.venue) {
      toast.error('Please fill in the title and venue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const publicationData = {
        ...formData,
        coAuthors: formData.coAuthors.split(',').map(author => author.trim()).filter(author => author),
      };

      const response = await apiClient.createPublication(publicationData);

      if (response.success) {
        toast.success('Publication added successfully!');
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(response.error || 'Failed to add publication.');
      }
    } catch (error) {
      console.error('Error adding publication:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#16213E] border-white/10 text-[#F0F0F0] max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl mb-2 flex items-center gap-2">
            <BookOpen size={24} className="text-[#00D9FF]" />
            Add New Publication
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., AI-Driven Personalized Learning..." className="bg-white/5 border-white/10" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue (Journal/Conference) *</Label>
            <Input id="venue" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} placeholder="e.g., IEEE Transactions on Education" className="bg-white/5 border-white/10" required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="citations">Citations</Label>
              <Input id="citations" type="number" value={formData.citations} onChange={(e) => setFormData({ ...formData, citations: parseInt(e.target.value) || 0 })} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="impact">Impact Factor</Label>
              <Input id="impact" type="number" step="0.1" value={formData.impact} onChange={(e) => setFormData({ ...formData, impact: parseFloat(e.target.value) || 0 })} className="bg-white/5 border-white/10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier">Tier</Label>
            <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#16213E] border-white/10">
                <SelectItem value="top">Top Tier</SelectItem>
                <SelectItem value="high">High Tier</SelectItem>
                <SelectItem value="medium">Medium Tier</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coAuthors">Co-Authors (comma-separated)</Label>
            <Input id="coAuthors" value={formData.coAuthors} onChange={(e) => setFormData({ ...formData, coAuthors: e.target.value })} placeholder="Dr. Wilson, Dr. Patel" className="bg-white/5 border-white/10" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-[#00D9FF] to-[#00E5CC] text-[#0F1419] hover:shadow-lg">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Publication
                </>
              )}
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