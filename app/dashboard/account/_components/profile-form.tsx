"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/lib/types/models/user";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  linkedInProfile: z.string().url().or(z.literal("")),
  portfolioUrl: z.string().url().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  user: User;
  onSubmit: (data: FormValues) => Promise<void>;
  hasAvatarChanges: boolean;
}

export function ProfileForm({
  onSubmit,
  user,
  hasAvatarChanges,
}: ProfileFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phoneNumber: user.phoneNumber ?? "",
      location: user.location ?? "",
      linkedInProfile: user.linkedInProfile ?? "",
      portfolioUrl: user.portfolioUrl ?? "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (er) => console.log(er))}
        className="space-y-4"
      >
        {/* NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* EMAIL */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Your email address is used for login and cannot be changed.
              </p>
            </FormItem>
          )}
        />

        {/* FIRST NAME */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="First name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LAST NAME */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Last name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PHONE NUMBER */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="08xxxxxxxxxx" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LOCATION */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="City, Country" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LINKEDIN */}
        <FormField
          control={form.control}
          name="linkedInProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://linkedin.com/in/username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PORTFOLIO */}
        <FormField
          control={form.control}
          name="portfolioUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://yourportfolio.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Updating...
            </>
          ) : hasAvatarChanges ? (
            "Save profile & avatar"
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  );
}
