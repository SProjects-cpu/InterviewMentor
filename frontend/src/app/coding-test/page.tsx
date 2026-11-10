'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
// Authentication removed
import { codingAPI } from '@/lib/api';
import {
  containerVariants,
  cardVariants,
  buttonVariants,
  fadeInVariants,
} from '@/lib/animations';
import {
  Code,
  Play,
  Trophy,
  Brain,
  Target,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  subtitle: string;
  difficulty: string;
  description: string;
  difficulty_class: string;
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

export default function CodingTestPage() {
  // Authentication removed - all users can access coding tests
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await codingAPI.getChallenges();
      setChallenges(response.challenges || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  // Authentication check removed - all users can access coding challenges

  return (
    <motion.div
      className="space-y-6 sm:space-y-8 md:space-y-12 will-change-transform overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section - Simplified animations */}
      <motion.div
        className="text-center space-y-3 sm:space-y-4 px-2 sm:px-4"
        variants={fadeInVariants}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <motion.div
            className="p-2 sm:p-3 rounded-lg bg-primary/10 hover-scale will-change-transform"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            <Code className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </motion.div>
          <h1 className="text-fluid-3xl sm:text-fluid-4xl md:text-fluid-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Coding Test
          </h1>
        </div>
        <motion.p
          className="text-fluid-base sm:text-fluid-lg text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
          variants={fadeInVariants}
          transition={{ delay: 0.2 }}
        >
          Practice coding challenges with real-time execution and AI-powered feedback.
          Improve your programming skills with our comprehensive coding test platform.
        </motion.p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 px-2 sm:px-4"
        variants={containerVariants}
      >
        <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
          <Card className="hover-lift">
            <CardHeader className="text-center">
              <motion.div
                className="mx-auto p-3 rounded-lg bg-green-100 text-green-600 w-fit"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Play className="h-6 w-6" />
              </motion.div>
              <CardTitle className="text-fluid-base sm:text-fluid-lg">Real-time Execution</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-fluid-sm sm:text-fluid-base leading-relaxed">
                Execute your code instantly and see results in real-time with support for multiple programming languages.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
          <Card className="hover-lift">
            <CardHeader className="text-center">
              <motion.div
                className="mx-auto p-3 rounded-lg bg-purple-100 text-purple-600 w-fit"
                whileHover={{ scale: 1.1, rotate: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Brain className="h-6 w-6" />
              </motion.div>
              <CardTitle className="text-fluid-base sm:text-fluid-lg">AI Code Review</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-fluid-sm sm:text-fluid-base leading-relaxed">
                Get intelligent feedback and suggestions from our AI-powered code review system.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} whileHover="hover" whileTap="tap">
          <Card className="hover-lift">
            <CardHeader className="text-center">
              <motion.div
                className="mx-auto p-3 rounded-lg bg-blue-100 text-blue-600 w-fit"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Trophy className="h-6 w-6" />
              </motion.div>
              <CardTitle className="text-fluid-base sm:text-fluid-lg">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-fluid-sm sm:text-fluid-base leading-relaxed">
                Track your progress, view your solution history, and monitor your improvement over time.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Challenges Section */}
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-fluid-xl sm:text-fluid-2xl font-bold">Coding Challenges</h2>
          <Badge variant="secondary" className="text-xs sm:text-sm flex-shrink-0">
            {challenges.length} Challenges Available
          </Badge>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : challenges.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 sm:py-12">
              <Code className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-fluid-base sm:text-fluid-lg font-semibold mb-2">No Challenges Available</h3>
              <p className="text-fluid-sm sm:text-fluid-base text-muted-foreground">
                Challenges are being prepared. Please check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={containerVariants}
          >
            {challenges.map((challenge, index) => {
              const DifficultyIcon = difficultyIcons[challenge.difficulty as keyof typeof difficultyIcons] || Target;

              return (
                <motion.div
                  key={challenge.id}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  custom={index}
                >
                  <Card className="hover-lift h-full">
                    <CardHeader className="pb-3 sm:pb-4">
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                          <CardTitle className="text-fluid-base sm:text-fluid-lg leading-tight">{challenge.title}</CardTitle>
                          <CardDescription className="text-fluid-sm leading-relaxed">{challenge.subtitle}</CardDescription>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <Badge
                            variant="outline"
                            className={`${difficultyColors[challenge.difficulty as keyof typeof difficultyColors]} text-xs`}
                          >
                            <DifficultyIcon className="h-3 w-3 mr-1" />
                            {challenge.difficulty}
                          </Badge>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 pt-0">
                      <div
                        className="text-fluid-sm text-muted-foreground line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: challenge.description }}
                      />
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button asChild className="w-full hover-glow min-h-[44px]">
                          <Link href={`/coding-test/${challenge.id}`}>
                            <Play className="mr-2 h-4 w-4" />
                            Start Challenge
                          </Link>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-8 px-2 sm:px-4"
        variants={containerVariants}
      >
        <motion.div className="text-center space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-muted/30" variants={fadeInVariants}>
          <motion.div
            className="text-fluid-xl sm:text-fluid-2xl font-bold text-primary"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            5+
          </motion.div>
          <div className="text-fluid-sm text-muted-foreground leading-tight">Languages Supported</div>
        </motion.div>
        <motion.div className="text-center space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-muted/30" variants={fadeInVariants}>
          <motion.div
            className="text-fluid-xl sm:text-fluid-2xl font-bold text-primary"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            AI
          </motion.div>
          <div className="text-fluid-sm text-muted-foreground leading-tight">Powered Reviews</div>
        </motion.div>
        <motion.div className="text-center space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-muted/30" variants={fadeInVariants}>
          <motion.div
            className="text-fluid-xl sm:text-fluid-2xl font-bold text-primary"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Real-time
          </motion.div>
          <div className="text-fluid-sm text-muted-foreground leading-tight">Code Execution</div>
        </motion.div>
        <motion.div className="text-center space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg bg-muted/30" variants={fadeInVariants}>
          <motion.div
            className="text-fluid-xl sm:text-fluid-2xl font-bold text-primary"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            24/7
          </motion.div>
          <div className="text-fluid-sm text-muted-foreground leading-tight">Available</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
