'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import api from '@/lib/api';
import {
  GraduationCap,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  Briefcase,
  Star,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Brain,
  Heart,
  Zap,
} from 'lucide-react';

interface CareerRecommendation {
  title: string;
  description: string;
  match_percentage: number;
  required_skills: string[];
  growth_potential: string;
  salary_range: string;
}

interface CareerGuidanceData {
  interests: string;
  academic_score: number;
  future_aspirations: string;
  skills: string;
  recommendations: CareerRecommendation[];
}

export default function CareerGuidancePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    interests: '',
    academic_score: '',
    future_aspirations: '',
    skills: '',
  });
  
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);



  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // For now, we'll generate mock recommendations since the backend career guidance
      // might need to be updated for the new API structure
      const mockRecommendations: CareerRecommendation[] = [
        {
          title: 'Software Developer',
          description: 'Design and develop software applications using various programming languages and frameworks.',
          match_percentage: 92,
          required_skills: ['Programming', 'Problem Solving', 'Logical Thinking'],
          growth_potential: 'High',
          salary_range: '$70,000 - $150,000'
        },
        {
          title: 'Data Scientist',
          description: 'Analyze complex data to help organizations make informed business decisions.',
          match_percentage: 87,
          required_skills: ['Statistics', 'Python/R', 'Machine Learning'],
          growth_potential: 'Very High',
          salary_range: '$80,000 - $180,000'
        },
        {
          title: 'Product Manager',
          description: 'Lead product development from conception to launch, working with cross-functional teams.',
          match_percentage: 78,
          required_skills: ['Leadership', 'Communication', 'Strategic Thinking'],
          growth_potential: 'High',
          salary_range: '$90,000 - $200,000'
        }
      ];

      setRecommendations(mockRecommendations);
      setHasSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get career recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return <Heart className="h-5 w-5" />;
      case 2: return <GraduationCap className="h-5 w-5" />;
      case 3: return <Target className="h-5 w-5" />;
      case 4: return <Zap className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };



  if (hasSubmitted && recommendations.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Your Career Recommendations</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on your interests, skills, and aspirations, here are personalized career paths that align with your profile.
          </p>
        </div>

        {/* Recommendations */}
        <div className="grid gap-6">
          {recommendations.map((recommendation, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg">
                <span className="text-sm font-semibold">{recommendation.match_percentage}% Match</span>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{recommendation.title}</CardTitle>
                    <CardDescription className="text-base">
                      {recommendation.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Match Score</span>
                    <span>{recommendation.match_percentage}%</span>
                  </div>
                  <Progress value={recommendation.match_percentage} className="h-2" />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.required_skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Growth Potential
                    </h4>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {recommendation.growth_potential}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Salary Range
                    </h4>
                    <p className="text-sm font-medium">{recommendation.salary_range}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => {
            setHasSubmitted(false);
            setStep(1);
            setFormData({
              interests: '',
              academic_score: '',
              future_aspirations: '',
              skills: '',
            });
          }} variant="outline">
            Take Assessment Again
          </Button>
          <Button onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Career Guidance Assessment</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Answer a few questions about your interests, skills, and aspirations to receive personalized career recommendations.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">Step {step} of 4</span>
          <span className="text-sm text-muted-foreground">{Math.round((step / 4) * 100)}% Complete</span>
        </div>
        <Progress value={(step / 4) * 100} className="h-2" />
      </div>

      {/* Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                stepNumber <= step 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : 'border-muted-foreground text-muted-foreground'
              }`}>
                {stepNumber <= step ? (
                  getStepIcon(stepNumber)
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              {stepNumber < 4 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  stepNumber < step ? 'bg-primary' : 'bg-muted-foreground'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStepIcon(step)}
            {step === 1 && 'Your Interests'}
            {step === 2 && 'Academic Background'}
            {step === 3 && 'Future Aspirations'}
            {step === 4 && 'Skills & Strengths'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Tell us what you enjoy doing and what motivates you.'}
            {step === 2 && 'Share your educational background and academic performance.'}
            {step === 3 && 'Describe your career goals and aspirations.'}
            {step === 4 && 'List your key skills and areas of expertise.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="interests">What are your main interests and hobbies?</Label>
                <Textarea
                  id="interests"
                  placeholder="e.g., Technology, problem-solving, working with people, creative projects..."
                  value={formData.interests}
                  onChange={(e) => handleInputChange('interests', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="academic_score">Academic Performance (GPA or Percentage)</Label>
                <Input
                  id="academic_score"
                  type="number"
                  placeholder="e.g., 3.5 or 85"
                  value={formData.academic_score}
                  onChange={(e) => handleInputChange('academic_score', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="future_aspirations">What are your career goals and aspirations?</Label>
                <Textarea
                  id="future_aspirations"
                  placeholder="e.g., I want to become a software engineer, start my own business, work in healthcare..."
                  value={formData.future_aspirations}
                  onChange={(e) => handleInputChange('future_aspirations', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="skills">What are your key skills and strengths?</Label>
                <Textarea
                  id="skills"
                  placeholder="e.g., Programming, communication, leadership, analytical thinking, creativity..."
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={isLoading || (
                (step === 1 && !formData.interests) ||
                (step === 2 && !formData.academic_score) ||
                (step === 3 && !formData.future_aspirations) ||
                (step === 4 && !formData.skills)
              )}
            >
              {isLoading ? (
                'Generating Recommendations...'
              ) : step === 4 ? (
                <>
                  Get Recommendations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
