import React, { useState } from 'react';
import { useResumeStore } from '@/hooks/use-resume-store';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, BookOpen, Award, Lightbulb, CheckCircle2 } from 'lucide-react';

// Advanced optimization strategies
const advancedStrategies = [
  {
    id: 'keywords',
    title: 'Keyword Optimization',
    icon: <Zap className="h-4 w-4 mr-2 text-amber-500" />,
    description: 'Include industry and job-specific keywords to pass ATS filters.',
    tips: [
      'Analyze the job description to identify key terms and phrases',
      'Include technical skills that match the job requirements',
      'Use standard industry terminology rather than company-specific jargon',
      'Incorporate keywords naturally throughout your resume, especially in your summary and experience'
    ]
  },
  {
    id: 'achievements',
    title: 'Achievement Focused Statements',
    icon: <Award className="h-4 w-4 mr-2 text-indigo-500" />,
    description: 'Transform duty descriptions into achievement statements with measurable results.',
    tips: [
      'Start bullet points with strong action verbs (Increased, Improved, Delivered, etc.)',
      'Follow the CAR formula: Challenge, Action, Result',
      'Quantify your achievements with percentages, dollar amounts, or time saved',
      'Focus on outcomes and impact rather than responsibilities'
    ]
  },
  {
    id: 'structure',
    title: 'Resume Structure Optimization',
    icon: <BookOpen className="h-4 w-4 mr-2 text-emerald-500" />,
    description: 'Organize your resume for maximum impact and readability.',
    tips: [
      'Position your most relevant experiences and skills first',
      'Use clear section headings and consistent formatting',
      'Ensure there is enough white space for readability',
      'Limit your resume to 1-2 pages depending on experience level'
    ]
  },
  {
    id: 'tailoring',
    title: 'Job-Specific Tailoring',
    icon: <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />,
    description: 'Customize your resume for each application to increase relevance.',
    tips: [
      'Adjust your summary to highlight qualifications most relevant to the job',
      'Reorder bullet points to emphasize experiences that match the job requirements',
      'Expand on relevant projects and condense less relevant ones',
      'Align your skills section with the specific technical requirements of the position'
    ]
  }
];

export function OptimizationPanel() {
  const { calculateATSScore, atsScore } = useResumeStore();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleRecalculateScore = () => {
    calculateATSScore();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-900">Resume Optimization</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRecalculateScore}
          className="text-xs"
        >
          <Zap className="h-3.5 w-3.5 mr-1" />
          Recalculate Score
        </Button>
      </div>

      {atsScore !== null && (
        <div className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-700">ATS Compatibility Score</span>
            <span className="text-sm font-bold text-slate-900">{atsScore}/100</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getScoreColorClass(atsScore)}`} 
              style={{ width: `${atsScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {getScoreMessage(atsScore)}
          </p>
        </div>
      )}

      <h4 className="text-sm font-medium text-slate-900 mb-2">Advanced Optimization Strategies</h4>
      
      <Accordion type="single" collapsible>
        {advancedStrategies.map(strategy => (
          <AccordionItem value={strategy.id} key={strategy.id}>
            <AccordionTrigger className="py-3">
              <div className="flex items-center text-left">
                {strategy.icon}
                <span className="text-sm font-medium">{strategy.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xs text-slate-600 mb-2">{strategy.description}</p>
              <ul className="space-y-1.5">
                {strategy.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-xs text-slate-700">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-4 pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-500 flex items-center">
          <InfoIcon className="h-3.5 w-3.5 mr-1.5" />
          These tips are based on industry best practices and ATS analysis
        </p>
      </div>
    </div>
  );
}

// Helper function to determine the color class based on score
function getScoreColorClass(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

// Helper function to get score feedback message
function getScoreMessage(score: number): string {
  if (score >= 80) {
    return 'Great job! Your resume is well-optimized for ATS systems.';
  } else if (score >= 60) {
    return 'Your resume is on the right track, but could use some improvements to better pass ATS systems.';
  } else {
    return 'Your resume needs significant optimization to effectively pass ATS systems.';
  }
}

// InfoIcon component
function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}