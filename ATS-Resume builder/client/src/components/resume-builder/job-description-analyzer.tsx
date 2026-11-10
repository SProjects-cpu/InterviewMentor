import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useResumeStore } from "@/hooks/use-resume-store";

interface JobAnalysis {
  requiredSkills: string[];
  preferredSkills: string[];
  keyResponsibilities: string[];
  experienceLevel: string;
  educationRequirements: string[];
}

export function JobDescriptionAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { calculateATSScore } = useResumeStore();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await apiRequest('POST', '/api/ai/analyze-job-description', {
        jobDescription: jobDescription.trim()
      });
      const data = await response.json();
      setAnalysis(data);
      
      // Recalculate ATS score with job description
      await calculateATSScore();
    } catch (error) {
      console.error('Error analyzing job description:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setJobDescription("");
    setAnalysis(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Job Description Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Paste the job description here to get personalized ATS optimization suggestions..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze}
              disabled={!jobDescription.trim() || isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="ri-search-line mr-2"></i>
                  Analyze Job Description
                </>
              )}
            </Button>
            
            {(jobDescription || analysis) && (
              <Button variant="outline" onClick={handleClear}>
                <i className="ri-close-line mr-2"></i>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <i className="ri-lightbulb-line mr-2 text-yellow-500"></i>
              Job Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Experience Level */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Experience Level</h4>
              <Badge variant="secondary" className="capitalize">
                {analysis.experienceLevel}
              </Badge>
            </div>

            <Separator />

            {/* Required Skills */}
            {analysis.requiredSkills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Required Skills ({analysis.requiredSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Skills */}
            {analysis.preferredSkills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Preferred Skills ({analysis.preferredSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.preferredSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Key Responsibilities */}
            {analysis.keyResponsibilities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Key Responsibilities
                </h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  {analysis.keyResponsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education Requirements */}
            {analysis.educationRequirements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Education Requirements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.educationRequirements.map((req, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                <i className="ri-information-line mr-1"></i>
                Your ATS score has been recalculated based on this job description. 
                Check the preview panel for updated recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
