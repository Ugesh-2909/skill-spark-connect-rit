
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExtendedProfileData } from "@/types/project.types";
import { useAuth } from "@/contexts/AuthContext";

interface EditProfileDialogProps {
  profileData: ExtendedProfileData;
  onProfileUpdated: (newProfileData: ExtendedProfileData) => void;
}

const formSchema = z.object({
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  department: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

export function EditProfileDialog({ profileData, onProfileUpdated }: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profileData.avatar_url
  );
  
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profileData.full_name || "",
      username: profileData.username || "",
      department: profileData.department || "",
      location: profileData.location || "",
      bio: profileData.bio || "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      let avatarUrl = profileData.avatar_url;
      
      // Upload avatar if a new one was selected
      if (avatarFile) {
        try {
          // First check if avatars bucket exists and create it if it doesn't
          const { data: buckets } = await supabase.storage.listBuckets();
          if (!buckets?.find(b => b.name === 'avatars')) {
            await supabase.storage.createBucket('avatars', { 
              public: true,
              fileSizeLimit: 5242880 // 5MB
            });
            console.log('Created avatars bucket');
          }
          
          // Upload the new avatar
          const fileExt = avatarFile.name.split('.').pop();
          const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile, { upsert: true });
            
          if (uploadError) throw uploadError;
          
          // Get the public URL
          const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
            
          avatarUrl = data.publicUrl;
          
          // Delete old avatar if exists and is not the default
          if (profileData.avatar_url && !profileData.avatar_url.includes('placeholder')) {
            try {
              const oldPath = profileData.avatar_url.split('/').slice(-2).join('/');
              await supabase.storage
                .from('avatars')
                .remove([oldPath]);
            } catch (deleteError) {
              console.error('Error removing old avatar, continuing anyway:', deleteError);
              // Continue execution even if deletion fails
            }
          }
        } catch (storageError) {
          console.error('Error with avatar upload:', storageError);
          // Continue with profile update even if avatar upload fails
          toast({
            title: "Avatar upload failed",
            description: "Your profile will be updated without the new avatar.",
            variant: "destructive",
          });
        }
      }
      
      // Update profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          username: values.username,
          department: values.department || null,
          location: values.location || null,
          bio: values.bio || null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Ensure we include all properties to match ExtendedProfileData
      const updatedProfile = {
        ...data,
        ...profileData, // Keep any existing properties that might not be part of the update
        full_name: values.full_name,
        username: values.username,
        department: values.department || null,
        location: values.location || null,
        bio: values.bio || null,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      } as ExtendedProfileData;
      
      // Call the onProfileUpdated callback with the new data
      onProfileUpdated(updatedProfile);
      
      setIsOpen(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto flex items-center gap-1">
          <Edit2 className="h-4 w-4 mr-1" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-3">
                <AvatarImage src={avatarPreview || undefined} />
                <AvatarFallback>
                  {profileData.full_name ? profileData.full_name.split(" ").map(n => n[0]).join("") : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("avatar")?.click()}
                >
                  Change Photo
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Science" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Rochester, NY" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself..." 
                      className="resize-none" 
                      rows={3} 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
