'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { codingAPI } from '@/lib/api';
import {
  containerVariants,
  cardVariants,
  buttonVariants,
  fadeInVariants,
  slideInLeftVariants,
  slideInRightVariants
} from '@/lib/animations';
import {
  Code,
  Play,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Target,
  Loader2,
  Brain,
  Terminal,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  subtitle: string;
  difficulty: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  solution_template: {
    [key: string]: string;
  };
  test_cases: Array<{
    input: string;
    expected_output: string;
  }>;
}

interface ExecutionResult {
  status: string;
  output: string;
  error?: string;
  execution_time?: number;
}

interface AIReview {
  status: string;
  message?: string;
  review?: string;
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Hard: 'bg-red-100 text-red-800 border-red-200',
};

const difficultyIcons = {
  Easy: CheckCircle,
  Medium: AlertCircle,
  Hard: Target,
};

const languages = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
];

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.challengeId as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [aiReview, setAIReview] = useState<AIReview | null>(null);

  useEffect(() => {
    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  useEffect(() => {
    if (challenge && challenge.solution_template) {
      setCode(challenge.solution_template[selectedLanguage] || '');
    }
  }, [challenge, selectedLanguage]);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const response = await codingAPI.getChallenge(challengeId);
      setChallenge(response.challenge);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  const executeCode = async () => {
    if (!code.trim()) {
      setError('Please write some code before executing');
      return;
    }

    try {
      setExecuting(true);
      setExecutionResult(null);
      setAIReview(null);
      setError(null);

      const response = await codingAPI.executeCode(code, selectedLanguage, challengeId);
      
      if (response.status === 'success') {
        setExecutionResult(response.execution_result);
        setAIReview(response.ai_review);
      } else {
        setError(response.message || 'Execution failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to execute code');
    } finally {
      setExecuting(false);
    }
  };



  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !challenge) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => router.push('/coding-test')}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challenges
        </Button>
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  const DifficultyIcon = difficultyIcons[challenge.difficulty as keyof typeof difficultyIcons] || Target;

  return (
    <motion.div
      className="container mx-auto px-4 py-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-4"
        variants={slideInLeftVariants}
      >
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/coding-test')}
            className="hover-scale"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div
          className="flex items-center gap-3"
          variants={slideInRightVariants}
        >
          <h1 className="text-2xl font-bold">{challenge.title}</h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant="outline"
              className={difficultyColors[challenge.difficulty as keyof typeof difficultyColors]}
            >
              <DifficultyIcon className="h-3 w-3 mr-1" />
              {challenge.difficulty}
            </Badge>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        {/* Problem Description */}
        <motion.div
          className="space-y-6"
          variants={slideInLeftVariants}
        >
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FileText className="h-5 w-5" />
                  </motion.div>
                  Problem Description
                </CardTitle>
                <CardDescription>{challenge.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: challenge.description }}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Examples - Simplified animations */}
          {challenge.examples && challenge.examples.length > 0 && (
            <motion.div variants={cardVariants} className="will-change-transform">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Examples
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {challenge.examples.map((example, index) => (
                    <div
                      key={index}
                      className="space-y-2 animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="text-sm font-medium">Example {index + 1}:</div>
                      <div className="bg-muted p-3 rounded-md space-y-2">
                        <div><strong>Input:</strong> {example.input}</div>
                        <div><strong>Output:</strong> {example.output}</div>
                        {example.explanation && (
                          <div><strong>Explanation:</strong> {example.explanation}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Constraints - Simplified */}
          {challenge.constraints && challenge.constraints.length > 0 && (
            <motion.div variants={cardVariants} className="will-change-transform">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Constraints</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {challenge.constraints.map((constraint, index) => (
                      <li
                        key={index}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.03}s` }}
                      >
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Code Editor - Optimized */}
        <motion.div
          className="space-y-6 will-change-transform"
          variants={fadeInVariants}
        >
          <motion.div variants={cardVariants} className="will-change-transform">
            <Card className="hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Editor
                  </CardTitle>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Write your code here..."
                  className="min-h-64 font-mono text-sm"
                />
                <Button
                  onClick={executeCode}
                  disabled={executing}
                  className="w-full hover-glow hover-scale will-change-transform"
                >
                  {executing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin-fast" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {executing ? 'Executing...' : 'Run Code'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Error Display - Simplified */}
          {error && (
            <div className="animate-fade-in">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Execution Result - Optimized */}
          {executionResult && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="will-change-transform"
            >
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    {executionResult.output || 'No output'}
                  </pre>
                  {executionResult.error && (
                    <Alert variant="destructive" className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{executionResult.error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* AI Review - Optimized */}
          {aiReview && aiReview.status === 'success' && aiReview.review && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="will-change-transform"
            >
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Code Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: aiReview.review }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
