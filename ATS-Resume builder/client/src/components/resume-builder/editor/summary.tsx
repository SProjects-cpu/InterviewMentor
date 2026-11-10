import { useResumeStore } from "@/hooks/use-resume-store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { countCharacters } from "@/lib/utils";
import { ContextualTip } from "../resume-tips";
import { useState } from "react";

export function SummaryForm() {
  const { content, setSummary, enhanceSummary, simplifySummary } = useResumeStore();
  const { summary } = content;
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSimplifying, setIsSimplifying] = useState(false);

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      await enhanceSummary();
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSimplify = async () => {
    setIsSimplifying(true);
    try {
      await simplifySummary();
    } finally {
      setIsSimplifying(false);
    }
  };

  // Extract keywords for ATS highlighting (simplified version)
  const getAtsKeywords = () => {
    if (!summary) return [];

    // Extract potential keywords (words that are important in resumes)
    const keywordRegex = /\b(develop|engineer|manage|lead|create|implement|design|architect|optimize|improve|increase|reduce|analyze|research|collaborate|coordinate|communication|teamwork|problem-solving|innovative|strategic|experienced|expert|proficient|skilled|certified|degree|Master's|Bachelor's|PhD)\w*\b/gi;
    
    const matches = summary.match(keywordRegex) || [];
    // Create a unique array of lowercase keywords
    const uniqueMatches: string[] = [];
    const seenKeywords = new Set<string>();
    
    matches.forEach(match => {
      const keyword = match.toLowerCase();
      if (!seenKeywords.has(keyword)) {
        seenKeywords.add(keyword);
        uniqueMatches.push(keyword);
      }
    });
    
    return uniqueMatches.slice(0, 5);
  };

  const atsKeywords = getAtsKeywords();
  const charCount = countCharacters(summary || "");

  return (
    <div className="p-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="summary" className="block text-sm font-medium text-slate-700 inline-flex items-center">
            Summary
            <ContextualTip field="summary" section="summary" />
          </label>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto py-1 px-1.5 text-primary-700 hover:text-primary-800 hover:bg-transparent"
              onClick={handleEnhance}
              disabled={!summary || isEnhancing}
            >
              {isEnhancing ? (
                <>
                  <i className="ri-loader-4-line mr-1 animate-spin"></i>
                  Enhancing...
                </>
              ) : (
                <>
                  <i className="ri-magic-line mr-1"></i>
                  Enhance
                </>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto py-1 px-1.5 text-primary-700 hover:text-primary-800 hover:bg-transparent"
              onClick={handleSimplify}
              disabled={!summary || isSimplifying}
            >
              {isSimplifying ? (
                <>
                  <i className="ri-loader-4-line mr-1 animate-spin"></i>
                  Simplifying...
                </>
              ) : (
                <>
                  <i className="ri-tools-line mr-1"></i>
                  Simplify
                </>
              )}
            </Button>
          </div>
        </div>
        <Textarea
          id="summary"
          rows={4}
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Write a professional summary..."
          value={summary || ""}
          onChange={(e) => setSummary(e.target.value)}
        />
        <div className="mt-2 flex justify-between">
          <div className="text-xs text-slate-500">
            {atsKeywords.length > 0 && (
              <>
                ATS Keywords: <span className="text-green-600">{atsKeywords.join(", ")}</span>
              </>
            )}
          </div>
          <div className="text-xs text-slate-500">
            {charCount}/500 characters
          </div>
        </div>
      </div>
    </div>
  );
}
