
import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface ProjectImageUploadProps {
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  setSelectedImage: (file: File | null) => void;
}

export function ProjectImageUpload({ 
  imagePreview, 
  setImagePreview, 
  setSelectedImage 
}: ProjectImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <FormLabel>Project Image</FormLabel>
      <div className="flex flex-col space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {imagePreview ? (
          <div className="relative w-full h-40">
            <img 
              src={imagePreview} 
              alt="Project preview" 
              className="w-full h-full object-cover rounded-md" 
            />
            <Button 
              size="sm" 
              variant="ghost" 
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              onClick={() => {
                setImagePreview(null);
                setSelectedImage(null);
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-40 w-full border-dashed"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-6 w-6 mb-2" />
              <span>Click to upload a project image</span>
              <span className="text-xs text-gray-500 mt-1">Max size: 5MB</span>
            </div>
          </Button>
        )}
      </div>
    </>
  );
}
