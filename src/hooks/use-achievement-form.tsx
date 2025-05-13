import React, { useState, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAchievements } from "@/hooks/use-achievements";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Award, Plus, Upload } from "lucide-react";
import { AchievementType, AchievementDifficulty } from '@/types/project.types';

interface AchievementFormProps {
  trigger?: ReactNode;
}

export function AchievementForm({ trigger }: AchievementFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [achievementType, setAchievementType] = useState<string>("Course Completion");
  const [difficulty, setDifficulty] = useState<string>("Beginner");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { toast } = useToast();
  const { addAchievement } = useAchievements();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (jpg, png, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your achievement",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await addAchievement(
        title, 
        description, 
        achievementType, 
        difficulty,
        imageFile || undefined
      );
      
      if (result) {
        setOpen(false);
        setTitle("");
        setDescription("");
        setAchievementType("Course Completion");
        setDifficulty("Beginner");
        setImageFile(null);
        setImagePreview(null);
        
        toast({
          title: "Achievement added",
          description: "Your achievement has been added successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error adding achievement",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const achievementTypes: AchievementType[] = [
    'Course Completion',
    'Certification',
    'Hackathon',
    'Research Publication',
    'Community Leadership'
  ];
  
  const difficultyLevels: AchievementDifficulty[] = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-uprit-indigo" />
            Add New Achievement
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              placeholder="Enter achievement title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              placeholder="Describe your achievement" 
              className="resize-none min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Achievement Type</Label>
              <Select
                value={achievementType}
                onValueChange={setAchievementType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {achievementTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={difficulty}
                onValueChange={setDifficulty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Achievement Image</Label>
            <div className="flex items-center space-x-4">
              <Label 
                htmlFor="image-upload" 
                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-uprit-indigo transition-colors flex flex-col items-center justify-center"
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-32 max-w-full object-contain mb-2" 
                  />
                ) : (
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                )}
                <span className="text-sm text-gray-500">
                  {imageFile ? imageFile.name : "Upload an image (optional)"}
                </span>
              </Label>
              <Input 
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Achievement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
