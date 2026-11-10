import { useResumeStore } from "@/hooks/use-resume-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ATSScoreProps {
  score: number;
  showDetails?: boolean;
  keywordMatches?: number;
  missingKeywords?: string[];
  suggestions?: string[];
}

export function ATSScore({
  score,
  showDetails = false,
  keywordMatches = 0,
  missingKeywords = [],
  suggestions = []
}: ATSScoreProps) {
  const { isCalculatingAtsScore } = useResumeStore();

  // Determine score color
  const getScoreClass = (score: number) => {
    if (score >= 80) return "text-green-700 bg-green-50";
    if (score >= 60) return "text-amber-700 bg-amber-50";
    return "text-red-700 bg-red-50";
  };

  if (isCalculatingAtsScore) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-slate-50 text-slate-700">
        <svg className="mr-1.5 h-2 w-2 text-slate-400 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" />
        </svg>
        Calculating...
      </span>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-md text-sm font-medium cursor-help",
            getScoreClass(score)
          )}>
            <svg className="mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            ATS Score: {score}
          </span>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4">
          <div className="space-y-3">
            <div>
              <p className="font-medium text-sm mb-1">ATS Compatibility Score</p>
              <p className="text-xs text-muted-foreground">
                This score indicates how well your resume will perform with automated applicant tracking systems.
              </p>
            </div>

            {keywordMatches > 0 && (
              <div>
                <p className="text-xs font-medium text-green-700">
                  ✓ {keywordMatches} keywords matched
                </p>
              </div>
            )}

            {missingKeywords.length > 0 && (
              <div>
                <p className="text-xs font-medium text-amber-700 mb-1">
                  Missing keywords:
                </p>
                <p className="text-xs text-muted-foreground">
                  {missingKeywords.slice(0, 3).join(", ")}
                </p>
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-blue-700 mb-1">
                  Top suggestion:
                </p>
                <p className="text-xs text-muted-foreground">
                  {suggestions[0]}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
