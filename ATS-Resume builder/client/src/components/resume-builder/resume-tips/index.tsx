import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface OptimizationTipProps {
  content: string;
  section: string;
  children?: React.ReactNode;
}

export const resumeOptimizationTips = {
  // Personal Info tips
  personalInfo: {
    fullName: "Use your full legal name for formal purposes. Nicknames can create inconsistencies with background checks.",
    jobTitle: "Match your job title to the position you're applying for when possible. Be specific rather than general.",
    email: "Use a professional email address, preferably with your name. Avoid unprofessional usernames.",
    phone: "Include your complete phone number with country and area codes. Ensure it's a number where you can be reached promptly.",
    location: "Your city and state/province are sufficient. Full addresses aren't necessary unless specifically requested.",
    profileUrl: "If including a LinkedIn or portfolio URL, ensure it's up-to-date and professional."
  },
  // Summary tips
  summary: "Keep your summary concise (3-5 sentences). Focus on your most relevant skills and experience for the position. Quantify achievements when possible.",
  // Experience section tips
  experience: {
    company: "Include the full official company name. For well-known companies with abbreviations (like IBM), the abbreviation is acceptable.",
    position: "Be specific with your job title. If your official title is vague, consider adding a more descriptive title in parentheses.",
    startDate: "Use consistent date formatting throughout your resume (e.g., MM/YYYY or Month YYYY).",
    endDate: "For current positions, use 'Present' rather than an end date.",
    description: "Use action verbs and quantify results when possible. Focus on achievements rather than responsibilities."
  },
  // Education tips
  education: {
    institution: "Use the full official name of your educational institution.",
    degree: "Specify your degree type (e.g., Bachelor of Science, Master of Arts).",
    field: "Include your major/concentration and minor if relevant to the position.",
    gpa: "Only include GPA if it's 3.5/4.0 or higher, or if you're a recent graduate."
  },
  // Skills tips
  skills: "List skills in order of relevance to the position. Include both technical and soft skills. Be honest about your proficiency level."
};

export function OptimizationTip({ content, section, children }: OptimizationTipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center cursor-help ml-1">
            {children || <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-white p-2 text-xs text-slate-700 border border-slate-200 shadow-lg">
          <div className="font-medium text-slate-900 mb-1">
            Resume Optimization Tip: <span className="text-primary-600">{section}</span>
          </div>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ContextualTip({ field, section }: { field: string; section: string }) {
  // Get the appropriate tip content based on section and field
  let tipContent = '';
  
  switch (section) {
    case 'personalInfo':
      tipContent = resumeOptimizationTips.personalInfo[field as keyof typeof resumeOptimizationTips.personalInfo] || '';
      break;
    case 'summary':
      tipContent = resumeOptimizationTips.summary;
      break;
    case 'experience':
      tipContent = resumeOptimizationTips.experience[field as keyof typeof resumeOptimizationTips.experience] || '';
      break;
    case 'education':
      tipContent = resumeOptimizationTips.education[field as keyof typeof resumeOptimizationTips.education] || '';
      break;
    case 'skills':
      tipContent = resumeOptimizationTips.skills;
      break;
    default:
      return null;
  }
  
  if (!tipContent) return null;
  
  return <OptimizationTip content={tipContent} section={field} />;
}