'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, MapPin, FileText, Sparkles } from 'lucide-react';

interface ComplaintFormProps {
  draftDescription?: string;
}

export function ComplaintForm({ draftDescription = '' }: ComplaintFormProps = {}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    sector: '',
    subject: '',
    description: draftDescription,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, sector: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.address || !formData.sector || !formData.subject || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const proceedToDraft = (photoUrl: string | null = null) => {
      const dataToSave = { ...formData, photoUrl };
      sessionStorage.setItem('complaintFormData', JSON.stringify(dataToSave));
      router.push('/register/draft');
    };

    if (files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        proceedToDraft(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      proceedToDraft();
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        // Mock address from coordinates
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        }));
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const sectorIcons: Record<string, string> = {
    garbage: '🗑️',
    electricity: '⚡',
    water: '💧',
    roads: '🛣️',
    other: '📋',
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-foreground font-semibold text-sm">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="bg-white border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-semibold text-sm">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="bg-white border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-foreground font-semibold text-sm">Location *</Label>
          <div className="flex gap-2">
            <Input
              name="address"
              placeholder="Enter address or coordinates"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="bg-white border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20 transition-all duration-200"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={useCurrentLocation}
              title="Use current location"
              className="border-border/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200 shrink-0"
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <Label htmlFor="sector" className="text-foreground font-semibold text-sm">Sector/Category *</Label>
          <Select value={formData.sector} onValueChange={handleSelectChange}>
            <SelectTrigger id="sector" className="bg-white border-border/50 text-foreground focus:border-primary focus:ring-primary/20">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="garbage">{sectorIcons.garbage} Garbage & Sanitation</SelectItem>
              <SelectItem value="electricity">{sectorIcons.electricity} Electricity</SelectItem>
              <SelectItem value="water">{sectorIcons.water} Water Supply</SelectItem>
              <SelectItem value="roads">{sectorIcons.roads} Roads & Infrastructure</SelectItem>
              <SelectItem value="other">{sectorIcons.other} Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-foreground font-semibold text-sm">Subject *</Label>
          <Input
            id="subject"
            name="subject"
            placeholder="Brief subject of your complaint"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="bg-white border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground font-semibold text-sm">Description *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Detailed description of the issue"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            required
            className="bg-white border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20 transition-all duration-200 resize-none"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="files" className="text-foreground font-semibold text-sm">Upload Media (Optional)</Label>
          <div className="border-2 border-dashed border-border/40 bg-secondary/30 rounded-xl p-6 text-center cursor-pointer hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300 group">
            <input
              id="files"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="files" className="cursor-pointer flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-medium text-foreground">Click to upload or drag and drop</div>
              <div className="text-xs text-muted-foreground">PNG, JPG, MP4 up to 10MB</div>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2 bg-secondary/30 rounded-xl p-4 border border-border/30">
              <p className="text-sm font-medium text-foreground">{files.length} file(s) selected:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Draft Button */}
        <Button
          type="submit"
          className="w-full py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Generating Draft...'
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Generate AI Draft
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
