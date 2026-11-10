import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResumeStore } from "@/hooks/use-resume-store";
import { Input } from "@/components/ui/input";
import { personalInfoSchema, type PersonalInfo } from "@shared/schema";
import { ContextualTip } from "../resume-tips";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";

export function PersonalInfoForm() {
  const { content, updatePersonalInfoField } = useResumeStore();
  const { personalInfo } = content;

  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
    mode: "onChange",
  });

  // Update form when store data changes
  useEffect(() => {
    form.reset(personalInfo);
  }, [personalInfo, form]);

  // Handle form field changes and update store
  const handleFieldChange = (field: keyof PersonalInfo, value: string) => {
    updatePersonalInfoField(field, value);
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-flex items-center">
                  Full Name
                  <ContextualTip field="fullName" section="personalInfo" />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Smith"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("fullName", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-flex items-center">
                  Job Title
                  <ContextualTip field="jobTitle" section="personalInfo" />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Frontend Developer"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("jobTitle", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-flex items-center">
                  Email
                  <ContextualTip field="email" section="personalInfo" />
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("email", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-flex items-center">
                  Phone
                  <ContextualTip field="phone" section="personalInfo" />
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("phone", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="inline-flex items-center">
                  Location
                  <ContextualTip field="location" section="personalInfo" />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="San Francisco, CA"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("location", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profileUrl"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="inline-flex items-center">
                  LinkedIn/Portfolio URL
                  <ContextualTip field="profileUrl" section="personalInfo" />
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/in/johnsmith"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("profileUrl", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
}
