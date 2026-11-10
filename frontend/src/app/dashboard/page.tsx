'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  TrendingUp,
  Target,
  Clock,
  Trophy,
  Brain,
  Code,
  FileText,
  GraduationCap,
  CheckCircle,
  Star,
  Calendar,
  BarChart3,
  Activity,
  Zap,
} from 'lucide-react';

interface DashboardStats {
  testsCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
  streak: number;
  recentActivity: Array<{
    type: string;
    title: string;
    score?: number;
    date: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    testsCompleted: 12,
    averageScore: 78,
    totalTimeSpent: 145,
    streak: 5,
    recentActivity: [
      { type: 'aptitude', title: 'Logical Reasoning Test', score: 85, date: '2024-01-15' },
      { type: 'coding', title: 'Array Manipulation Challenge', score: 92, date: '2024-01-14' },
      { type: 'aptitude', title: 'Verbal Ability Test', score: 76, date: '2024-01-13' },
      { type: 'career', title: 'Career Guidance Assessment', date: '2024-01-12' },
    ]
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'aptitude': return <Brain className="h-4 w-4" />;
      case 'coding': return <Code className="h-4 w-4" />;
      case 'career': return <GraduationCap className="h-4 w-4" />;
      case 'resume': return <FileText className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, DemoUser! Here's your learning progress overview.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTimeSpent}h</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Skill Progress
              </CardTitle>
              <CardDescription>
                Your performance across different skill areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Logical Reasoning</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Coding Skills</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Verbal Ability</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Technical Knowledge</span>
                  <span>80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest test results and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {activity.score && (
                      <Badge variant="outline" className={getScoreColor(activity.score)}>
                        {activity.score}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/aptitude">
                  <Brain className="mr-2 h-4 w-4" />
                  Take Aptitude Test
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/coding-test">
                  <Code className="mr-2 h-4 w-4" />
                  Practice Coding
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/career-guidance">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Career Guidance
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/profile">
                  <FileText className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">First Perfect Score</p>
                  <p className="text-xs text-muted-foreground">Coding Challenge</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">5-Day Streak</p>
                  <p className="text-xs text-muted-foreground">Daily Practice</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Test Master</p>
                  <p className="text-xs text-muted-foreground">10 Tests Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Reminder */}
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              <strong>Study Reminder:</strong> You haven't taken a test today. 
              Keep your streak going!
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
