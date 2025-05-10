
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjects } from '@/hooks/use-projects';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/hooks/use-points';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Form
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Code } from 'lucide-react';
import { ProjectFormFields } from './ProjectFormFields';

const projectFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }).max(100),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }).max(1000),
  status: z.enum(['planning', 'in_progress', 'completed', 'archived']),
  timeline_status: z.enum(['ongoing', 'past', 'future']).default('ongoing'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  onSuccess?: () => void;
}

export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { createProject } = useProjects();
  const { awardPointsForProject } = usePoints();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "planning",
      timeline_status: "ongoing",
      start_date: "",
      end_date: "",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const projectData = {
        title: data.title,
        description: data.description,
        status: data.status,
        timeline_status: data.timeline_status,
        start_date: data.start_date,
        end_date: data.end_date,
        image: selectedImage
      };
      
      const result = await createProject(projectData);
      
      if (result && user) {
        // Award points for creating a project
        await awardPointsForProject(user.id, data.status);
        
        toast({
          title: "Project created",
          description: "Your project has been created successfully",
        });
        
        form.reset();
        setImagePreview(null);
        setSelectedImage(null);
        setOpen(false);
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Failed to create project",
        description: "There was an error creating your project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Start a new project and earn points on the leaderboard. You can invite team members after creation.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <ProjectFormFields 
                form={form}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                setSelectedImage={setSelectedImage}
              />
            </form>
          </Form>
        </ScrollArea>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
