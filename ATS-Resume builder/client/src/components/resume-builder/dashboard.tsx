import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useResumeStore } from "@/hooks/use-resume-store";
import { useScreenSize } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function ResumeDashboard() {
  const {
    content,
    atsScore,
    atsSuggestions,
    atsKeywordMatches,
    atsMissingKeywords,
    calculateATSScore
  } = useResumeStore();
  const screenSize = useScreenSize();

  const [completionScore, setCompletionScore] = useState(0);

  useEffect(() => {
    // Calculate completion score based on filled sections
    let score = 0;
    const maxScore = 100;
    
    // Personal info (20 points)
    if (content.personalInfo.fullName) score += 5;
    if (content.personalInfo.email) score += 5;
    if (content.personalInfo.phone) score += 5;
    if (content.personalInfo.jobTitle) score += 5;
    
    // Summary (20 points)
    if (content.summary && content.summary.length > 50) score += 20;
    
    // Experience (30 points)
    if (content.experience.length > 0) score += 15;
    if (content.experience.some(exp => exp.description.length > 0)) score += 15;
    
    // Education (15 points)
    if (content.education.length > 0) score += 15;
    
    // Skills (15 points)
    if (content.skills.length >= 3) score += 15;
    
    setCompletionScore(Math.min(score, maxScore));
  }, [content]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletionColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={cn(
      "grid gap-3 lg:gap-4",
      screenSize === 'mobile'
        ? "grid-cols-1 mb-4"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6"
    )}>
      {/* Resume Completion */}
      <Card>
        <CardHeader className={cn(screenSize === 'mobile' ? "pb-2" : "pb-3")}>
          <CardTitle className={cn(
            "font-medium flex items-center",
            screenSize === 'mobile' ? "text-xs" : "text-sm"
          )}>
            <i className="ri-file-text-line mr-2 text-blue-500"></i>
            Resume Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(screenSize === 'mobile' ? "space-y-1" : "space-y-2")}>
            <div className="flex justify-between items-center">
              <span className={cn(
                "font-bold",
                screenSize === 'mobile' ? "text-xl" : "text-2xl"
              )}>{completionScore}%</span>
              <Badge variant={completionScore >= 80 ? "default" : "secondary"}>
                {completionScore >= 80 ? "Complete" : "In Progress"}
              </Badge>
            </div>
            <Progress
              value={completionScore}
              className="h-2"
            />
            <p className={cn(
              "text-muted-foreground",
              screenSize === 'mobile' ? "text-xs" : "text-xs"
            )}>
              {completionScore < 100 ? "Add more details to improve your resume" : "Your resume is complete!"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ATS Score */}
      <Card>
        <CardHeader className={cn(screenSize === 'mobile' ? "pb-2" : "pb-3")}>
          <CardTitle className={cn(
            "font-medium flex items-center",
            screenSize === 'mobile' ? "text-xs" : "text-sm"
          )}>
            <i className="ri-search-eye-line mr-2 text-purple-500"></i>
            ATS Compatibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(screenSize === 'mobile' ? "space-y-1" : "space-y-2")}>
            <div className="flex justify-between items-center">
              <span className={cn(
                `font-bold ${getScoreColor(atsScore || 0)}`,
                screenSize === 'mobile' ? "text-xl" : "text-2xl"
              )}>
                {atsScore || "--"}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={calculateATSScore}
                className={cn(
                  screenSize === 'mobile' ? "h-6 px-1 text-xs" : "h-6 px-2 text-xs"
                )}
              >
                <i className="ri-refresh-line mr-1"></i>
                {screenSize === 'mobile' ? '' : 'Update'}
              </Button>
            </div>
            <Progress
              value={atsScore || 0}
              className="h-2"
            />
            <p className={cn(
              "text-muted-foreground",
              screenSize === 'mobile' ? "text-xs" : "text-xs"
            )}>
              {atsScore ?
                (atsScore >= 80 ? "Excellent ATS compatibility" :
                 atsScore >= 60 ? "Good, but can be improved" : "Needs optimization")
                : "Click update to calculate"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <i className="ri-bar-chart-line mr-2 text-green-500"></i>
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Experience</span>
              <span className="font-medium">{content.experience.length} jobs</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Skills</span>
              <span className="font-medium">{content.skills.length} skills</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Education</span>
              <span className="font-medium">{content.education.length} degrees</span>
            </div>
            {atsKeywordMatches > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Keywords</span>
                <span className="font-medium text-green-600">{atsKeywordMatches} matched</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      {atsSuggestions.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <i className="ri-lightbulb-line mr-2 text-yellow-500"></i>
              Quick Improvement Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {atsSuggestions.slice(0, 4).map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-blue-800">{suggestion}</p>
                </div>
              ))}
            </div>
            {atsMissingKeywords.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-2">Missing Keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {atsMissingKeywords.slice(0, 6).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-amber-700 border-amber-300">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
