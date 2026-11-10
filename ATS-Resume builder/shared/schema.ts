import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Resume schemas
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  template: text("template").notNull().default("stockholm"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  content: jsonb("content").notNull(),
  atsScore: integer("ats_score"),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

// Resume content schemas using Zod
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  jobTitle: z.string().optional(),
  email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "Invalid email address"
  }),
  phone: z.string().optional(),
  location: z.string().optional(),
  profileUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Invalid URL"
  }),
});

export const experienceItemSchema = z.object({
  id: z.string().uuid().optional(),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.array(z.string()).default([]),
});

export const educationItemSchema = z.object({
  id: z.string().uuid().optional(),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  description: z.array(z.string()).default([]),
});

export const certificationItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Invalid URL"
  }),
});

export const projectItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  url: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Invalid URL"
  }),
  highlights: z.array(z.string()).default([]),
});

export const languageItemSchema = z.object({
  id: z.string().uuid().optional(),
  language: z.string().min(1, "Language is required"),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Native", "Fluent"]),
});

export const volunteerItemSchema = z.object({
  id: z.string().uuid().optional(),
  organization: z.string().min(1, "Organization is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.array(z.string()).default([]),
  location: z.string().optional(),
});

export const resumeContentSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().optional(),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(certificationItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  languages: z.array(languageItemSchema).default([]),
  volunteer: z.array(volunteerItemSchema).default([]),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type LanguageItem = z.infer<typeof languageItemSchema>;
export type VolunteerItem = z.infer<typeof volunteerItemSchema>;
export type ResumeContent = z.infer<typeof resumeContentSchema>;

// Types for template
export const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["all", "modern", "professional", "creative"]).default("all"),
  isPremium: z.boolean().default(false),
});

export type Template = z.infer<typeof templateSchema>;
