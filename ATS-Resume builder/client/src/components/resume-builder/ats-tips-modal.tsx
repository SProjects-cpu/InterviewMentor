import { useEffect, useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ATSTipsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ATSTipsModal({ open, onOpenChange }: ATSTipsModalProps) {
  const { atsScore, atsSuggestions, content } = useResumeStore();
  const [suggestions, setSuggestions] = useState<{ type: 'success' | 'warning' | 'info'; message: string }[]>([]);

  useEffect(() => {
    if (open) {
      const newSuggestions: { type: 'success' | 'warning' | 'info'; message: string }[] = [];
      
      // Process ATS suggestions
      atsSuggestions.forEach(suggestion => {
        newSuggestions.push({ type: 'warning', message: suggestion });
      });
      
      // Add standard tips based on content
      if (content.personalInfo.email && content.personalInfo.phone) {
        newSuggestions.push({ 
          type: 'success', 
          message: 'Your contact information is complete and clearly formatted for ATS parsing'
        });
      }
      
      if (content.skills.length >= 5) {
        newSuggestions.push({ 
          type: 'success', 
          message: 'Your resume includes a good number of skills that ATS systems can match' 
        });
      }
      
      if (content.summary && content.summary.length > 100) {
        newSuggestions.push({ 
          type: 'info', 
          message: 'Your professional summary is well-developed and provides good context'
        });
      }
      
      if (content.experience.length > 0) {
        const hasDateFormat = content.experience.every(exp => exp.startDate && (exp.endDate || exp.current));
        if (hasDateFormat) {
          newSuggestions.push({ 
            type: 'success', 
            message: 'Your employment dates are clearly formatted for ATS parsing'
          });
        }
      }
      
      setSuggestions(newSuggestions);
    }
  }, [open, atsScore, atsSuggestions, content]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <i className="ri-search-eye-line text-primary-700 text-xl mr-2"></i>
            ATS Optimization Tips
          </AlertDialogTitle>
          <AlertDialogDescription>
            Optimize your resume for Applicant Tracking Systems with these suggestions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div className="flex items-start" key={index}>
              <div className="flex-shrink-0">
                {suggestion.type === 'success' && <i className="ri-checkbox-circle-fill text-green-500 mt-0.5"></i>}
                {suggestion.type === 'warning' && <i className="ri-error-warning-fill text-amber-500 mt-0.5"></i>}
                {suggestion.type === 'info' && <i className="ri-information-fill text-blue-500 mt-0.5"></i>}
              </div>
              <div className="ml-3">
                <p className="text-sm text-slate-700">{suggestion.message}</p>
              </div>
            </div>
          ))}
          
          {suggestions.length === 0 && (
            <div className="text-center py-4 text-sm text-slate-500">
              No suggestions available at this time.
            </div>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction>Apply Suggestions</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
