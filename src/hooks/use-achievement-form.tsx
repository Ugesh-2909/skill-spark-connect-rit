
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAchievements } from '@/hooks/use-achievements';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/hooks/use-points';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from 'lucide-react';

const achievementFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }).max(100),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }).max(500),
  achievement_type: z.string().min(1, {
    message: "Achievement type is required",
  }),
  difficulty: z.string().min(1, {
    message: "Difficulty level is required",
  }),
});

type AchievementFormValues = z.infer<typeof achievementFormSchema>;

export function AchievementForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { addAchievement } = useAchievements();
  const { toast } = useToast();
  const { calculateAchievementPoints, ACHIEVEMENT_TYPE_MULTIPLIERS, DIFFICULTY_MULTIPLIERS } = usePoints();
  
  // Calculated points preview
  const [pointsPreview, setPointsPreview] = useState(10); // Default points

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      title: "",
      description: "",
      achievement_type: "Course Completion",
      difficulty: "Beginner",
    },
  });

  // Watch for changes to update points preview
  const achievementType = form.watch("achievement_type");
  const difficulty = form.watch("difficulty");

  // Update points preview when type or difficulty changes
  const updatePointsPreview = () => {
    const newPoints = calculateAchievementPoints(
      achievementType || "Course Completion",
      difficulty || "Beginner"
    );
    setPointsPreview(newPoints);
  };
  
  // Update points preview whenever type or difficulty changes
  React.useEffect(() => {
    updatePointsPreview();
  }, [achievementType, difficulty]);

  const onSubmit = async (data: AchievementFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await addAchievement(
        data.title, 
        data.description, 
        data.achievement_type, 
        data.difficulty
      );
      
      if (result) {
        toast({
          title: "Achievement added",
          description: `Your achievement has been added and earned ${result.points} points`,
        });
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      console.error('Error submitting achievement:', error);
      toast({
        title: "Failed to add achievement",
        description: "There was an error adding your achievement",
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
          Add Achievement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>New Achievement</DialogTitle>
          <DialogDescription>
            Add a new achievement and earn points on the leaderboard.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achievement Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your achievement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="achievement_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievement Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select achievement type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(ACHIEVEMENT_TYPE_MULTIPLIERS).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(DIFFICULTY_MULTIPLIERS).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your achievement in detail" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about your achievement, what you did, and what you learned.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Points</span>
                <Badge className="text-lg py-1 px-3">{pointsPreview} pts</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Points are calculated based on achievement type and difficulty level
              </p>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Achievement"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
