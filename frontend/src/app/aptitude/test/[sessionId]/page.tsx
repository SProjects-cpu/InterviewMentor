'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { aptitudeAPI } from '@/lib/api';
// Authentication removed
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  AlertTriangle,
  CheckCircle,
  Timer
} from 'lucide-react';

interface Question {
  question: string;
  options?: string[];
  type?: string;
}

interface TestData {
  question: Question;
  current_question: number;
  total_questions: number;
  remaining_time: number;
  progress: number;
}

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.sessionId as string);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  // Authentication removed

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Load question
  const loadQuestion = useCallback(async (questionIndex: number) => {
    try {
      setLoading(true);
      const response = await aptitudeAPI.getQuestion(sessionId.toString(), questionIndex);
      setTestData(response);
      setTimeLeft(Math.floor(response.remaining_time));

      // Set selected answer if already answered
      if (answers[questionIndex]) {
        setSelectedAnswer(answers[questionIndex]);
      } else {
        setSelectedAnswer('');
      }
    } catch (error: any) {
      setError('Failed to load question');
      console.error('Error loading question:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId, answers]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 60 && !showTimeWarning) {
            setShowTimeWarning(true);
          }
          if (newTime <= 0) {
            handleFinishTest();
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, showTimeWarning]);

  // Load initial question
  useEffect(() => {
    if (sessionId) {
      loadQuestion(currentQuestionIndex);
    }
  }, [sessionId, currentQuestionIndex, loadQuestion]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer) {
      try {
        setSubmitting(true);
        await aptitudeAPI.submitAnswer(sessionId.toString(), currentQuestionIndex, selectedAnswer);

        if (currentQuestionIndex + 1 < (testData?.total_questions || 0)) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          handleFinishTest();
        }
      } catch (error: any) {
        setError('Failed to submit answer');
        console.error('Error submitting answer:', error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinishTest = async () => {
    try {
      // Submit current answer if any
      if (selectedAnswer) {
        await aptitudeAPI.submitAnswer(sessionId.toString(), currentQuestionIndex, selectedAnswer);
      }

      // Navigate to results
      router.push(`/aptitude/results/${sessionId}`);
    } catch (error: any) {
      console.error('Error finishing test:', error);
      router.push(`/aptitude/results/${sessionId}`);
    }
  };

  // Authentication check removed

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Test</h1>
        <p className="text-muted-foreground mb-4">{error || 'Test not found'}</p>
        <Button onClick={() => router.push('/aptitude')}>
          Back to Tests
        </Button>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex + 1 >= testData.total_questions;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Aptitude Test</h1>
          <p className="text-muted-foreground">
            Question {testData.current_question} of {testData.total_questions}
          </p>
        </div>
        
        {/* Timer */}
        <div className="flex items-center gap-4">
          {showTimeWarning && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Less than 1 minute remaining!
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center gap-2 text-lg font-mono">
            <Timer className={`h-5 w-5 ${timeLeft <= 60 ? 'text-red-500' : 'text-muted-foreground'}`} />
            <span className={timeLeft <= 60 ? 'text-red-500 font-bold' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(testData.progress)}%</span>
        </div>
        <Progress value={testData.progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Question {testData.current_question}
            </CardTitle>
            <Badge variant="outline">
              {testData.total_questions - testData.current_question + 1} remaining
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Question Text */}
          <div className="text-lg leading-relaxed">
            {testData.question.question}
          </div>

          {/* Answer Options */}
          {testData.question.options && testData.question.options.length > 0 ? (
            <div className="space-y-3">
              {testData.question.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedAnswer === option
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedAnswer === option
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}>
                    {selectedAnswer === option && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </label>
              ))}
            </div>
          ) : (
            // Text input for non-multiple choice questions
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Answer:</label>
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your answer..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleFinishTest}
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            <Flag className="mr-2 h-4 w-4" />
            Finish Test
          </Button>

          <Button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer || submitting}
          >
            {submitting ? (
              'Submitting...'
            ) : isLastQuestion ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit Test
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
