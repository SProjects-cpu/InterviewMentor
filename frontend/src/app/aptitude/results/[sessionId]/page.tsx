'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { aptitudeAPI } from '@/lib/api';
// Authentication removed
import { 
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Share2,
  Download,
  TrendingUp,
  Award,
  AlertTriangle
} from 'lucide-react';

interface DetailedResult {
  question_number: number;
  question: string;
  options: string[];
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
}

interface TestResults {
  session_id: number;
  test_id: string;
  score: number;
  total_questions: number;
  score_percentage: number;
  performance: string;
  performance_color: string;
  time_taken: number;
  detailed_results: DetailedResult[];
}

const performanceConfig = {
  'Excellent': { color: 'text-green-600', bgColor: 'bg-green-100', icon: Trophy },
  'Good': { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Award },
  'Average': { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Target },
  'Needs Improvement': { color: 'text-red-600', bgColor: 'bg-red-100', icon: TrendingUp },
};

export default function TestResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.sessionId as string);
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  // Authentication removed

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await aptitudeAPI.getResults(sessionId.toString());
        setResults(response);
      } catch (error: any) {
        setError('Failed to load test results');
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResults();
    }
  }, [sessionId]);

  // Authentication check removed

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading your results...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Results</h1>
        <p className="text-muted-foreground mb-4">{error || 'Results not found'}</p>
        <Button onClick={() => router.push('/aptitude')}>
          Back to Tests
        </Button>
      </div>
    );
  }

  const performanceInfo = performanceConfig[results.performance as keyof typeof performanceConfig];
  const PerformanceIcon = performanceInfo?.icon || Trophy;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${performanceInfo?.bgColor}`}>
          <PerformanceIcon className={`h-10 w-10 ${performanceInfo?.color}`} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Test Completed!</h1>
          <p className="text-muted-foreground">Here are your results</p>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-4xl font-bold text-primary mb-2">
              {results.score_percentage}%
            </div>
            <p className="text-muted-foreground">Overall Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-6">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {results.score}/{results.total_questions}
            </div>
            <p className="text-muted-foreground">Correct Answers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-6">
            <div className={`text-2xl font-bold mb-2 ${performanceInfo?.color}`}>
              {results.performance}
            </div>
            <p className="text-muted-foreground">Performance Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score Progress</span>
              <span>{results.score_percentage}%</span>
            </div>
            <Progress value={results.score_percentage} className="h-3" />
          </div>

          {/* Performance Feedback */}
          <Alert className={`border-l-4 ${
            results.score_percentage >= 90 ? 'border-green-500 bg-green-50' :
            results.score_percentage >= 75 ? 'border-blue-500 bg-blue-50' :
            results.score_percentage >= 60 ? 'border-yellow-500 bg-yellow-50' :
            'border-red-500 bg-red-50'
          }`}>
            <AlertDescription>
              {results.score_percentage >= 90 && 
                "Excellent work! You have a strong understanding of the concepts. Keep up the great work!"
              }
              {results.score_percentage >= 75 && results.score_percentage < 90 && 
                "Good job! You have a solid grasp of most concepts. Review the areas you missed to improve further."
              }
              {results.score_percentage >= 60 && results.score_percentage < 75 && 
                "Average performance. Focus on understanding the fundamental concepts and practice more questions."
              }
              {results.score_percentage < 60 && 
                "There's room for improvement. Consider reviewing the study materials and practicing more questions in this area."
              }
            </AlertDescription>
          </Alert>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{results.score}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {results.total_questions - results.score}
              </div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{results.time_taken}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{results.total_questions}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Question-by-Question Review</CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowDetailedResults(!showDetailedResults)}
            >
              {showDetailedResults ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          <CardDescription>
            Review each question to understand your performance better
          </CardDescription>
        </CardHeader>
        
        {showDetailedResults && (
          <CardContent className="space-y-4">
            {results.detailed_results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1 rounded-full ${
                    result.is_correct ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {result.is_correct ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="font-medium">
                      Question {result.question_number}: {result.question}
                    </div>
                    
                    {result.options.length > 0 && (
                      <div className="text-sm space-y-1">
                        <div>Your answer: <span className={result.is_correct ? 'text-green-600' : 'text-red-600'}>{result.user_answer}</span></div>
                        <div>Correct answer: <span className="text-green-600">{result.correct_answer}</span></div>
                      </div>
                    )}
                    
                    {result.explanation && (
                      <div className="text-sm text-muted-foreground bg-white p-2 rounded border">
                        <strong>Explanation:</strong> {result.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/aptitude">
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Another Test
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <Button variant="outline" size="lg" onClick={() => window.print()}>
          <Download className="mr-2 h-4 w-4" />
          Download Results
        </Button>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.score_percentage < 60 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Consider reviewing fundamental concepts and taking practice tests to improve your understanding.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Next Steps:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Review questions you got wrong</li>
                  <li>• Practice similar question types</li>
                  <li>• Take tests in other categories</li>
                  <li>• Track your progress over time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Study Resources:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Access our study materials</li>
                  <li>• Join practice sessions</li>
                  <li>• Get personalized recommendations</li>
                  <li>• Connect with other learners</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
