'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Brain,
  Code,
  FileText,
  GraduationCap,
  Rocket,
  Play,
  TrendingUp,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

const stats = [
  { number: 10000, label: 'Students Prepared' },
  { number: 500, label: 'Coding Challenges' },
  { number: 95, label: 'Success Rate %' },
  { number: 24, label: 'Hours Support' },
];

const features = [
  {
    icon: Brain,
    title: 'Aptitude Testing',
    description: 'Test your logical reasoning, verbal ability, and technical knowledge with our comprehensive aptitude tests. Get detailed insights into your strengths and areas for improvement.',
    href: '/aptitude',
    buttonText: 'Start Test',
    color: 'text-green-600',
  },
  {
    icon: Code,
    title: 'AI Coding Test',
    description: 'Practice coding challenges with real-time AI feedback. Solve problems in multiple programming languages and receive personalized code reviews.',
    href: '/coding-test',
    buttonText: 'Start Coding',
    color: 'text-purple-600',
    badge: 'New',
  },
  {
    icon: FileText,
    title: 'Resume Builder',
    description: 'Create professional resumes with our interactive builder. Choose from multiple templates and optimize your resume to stand out to potential employers.',
    href: '/resume-builder',
    buttonText: 'Build Resume',
    color: 'text-blue-600',
  },
  {
    icon: GraduationCap,
    title: 'Career Guidance',
    description: 'Get personalized career advice from industry experts. Learn about different career paths, salary expectations, and skills required for various tech roles.',
    href: '/career-guidance',
    buttonText: 'Explore Careers',
    color: 'text-amber-600',
  },
];

const testimonials = [
  {
    quote: "The AI coding feedback helped me identify patterns in my code that I wasn't aware of. I passed my technical interview at Google!",
    author: "Michael Chen",
    role: "Software Engineer at Google",
    avatar: "MC",
  },
  {
    quote: "The aptitude tests were incredibly helpful in preparing for my interviews. The questions were challenging and similar to what I faced in actual interviews.",
    author: "Sarah Johnson",
    role: "Data Scientist at Microsoft",
    avatar: "SJ",
  },
  {
    quote: "The resume builder is fantastic! It helped me create a professional resume that got me multiple interview calls.",
    author: "Emily Liu",
    role: "Product Manager at Amazon",
    avatar: "EL",
  },
];

export default function Home() {
  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16 xl:space-y-20 overflow-x-hidden w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 sm:space-y-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 w-full">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6 w-full">
          <h1 className="text-fluid-4xl sm:text-fluid-5xl md:text-fluid-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight mx-auto">
            Master Your Interview Skills
          </h1>
          <p className="text-fluid-base sm:text-fluid-lg lg:text-fluid-xl text-muted-foreground max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed">
            Prepare for success with our comprehensive interview preparation platform.
            Practice coding challenges, build professional resumes, and get AI-powered feedback
            to land your dream job.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 xl:gap-8 justify-center">
          <Button asChild size="lg" className="text-fluid-base px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] lg:min-h-[56px] xl:min-h-[64px]">
            <Link href="/aptitude">
              <Rocket className="mr-2 h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6" />
              Get Started Free
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="text-fluid-base px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] lg:min-h-[56px] xl:min-h-[64px]">
            <Link href="#features">
              <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6" />
              Learn More
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 max-w-[1800px] mx-auto">
        {stats.map((stat, index) => (
          <div key={index} className="text-center space-y-1 sm:space-y-2 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-lg bg-muted/30">
            <div className="text-fluid-2xl sm:text-fluid-3xl md:text-fluid-4xl lg:text-fluid-5xl xl:text-fluid-6xl font-bold text-primary">
              {stat.number.toLocaleString()}{stat.label.includes('%') ? '%' : ''}
            </div>
            <div className="text-fluid-sm sm:text-fluid-base lg:text-fluid-lg xl:text-fluid-xl text-muted-foreground leading-tight">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section id="features" className="space-y-6 sm:space-y-8 md:space-y-12 px-2 sm:px-4 lg:px-8 max-w-[1800px] mx-auto">
        <div className="text-center space-y-3 sm:space-y-4 lg:space-y-6">
          <h2 className="text-fluid-3xl sm:text-fluid-4xl md:text-fluid-5xl font-bold">Comprehensive Interview Preparation</h2>
          <p className="text-fluid-base sm:text-fluid-lg text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto">Everything you need to succeed in your next interview</p>
        </div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="relative overflow-hidden h-full">
                <CardHeader className="pb-3 sm:pb-4 lg:pb-6">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 flex-col sm:flex-row">
                    <div className={`p-2 sm:p-3 lg:p-4 rounded-lg bg-muted ${feature.color} flex-shrink-0`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="flex items-center gap-2 text-fluid-lg sm:text-fluid-xl lg:text-fluid-2xl flex-wrap">
                        <span className="break-words">{feature.title}</span>
                        {feature.badge && (
                          <Badge variant="secondary" className="text-xs sm:text-sm flex-shrink-0">
                            {feature.badge}
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 lg:space-y-6 pt-0">
                  <CardDescription className="text-fluid-sm sm:text-fluid-base lg:text-fluid-lg leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Button asChild className="w-full sm:w-auto min-h-[44px] lg:min-h-[52px] lg:text-fluid-base">
                    <Link href={feature.href}>
                      <Icon className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                      {feature.buttonText}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Progress Showcase */}
      <section className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start px-2 sm:px-4">
        <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
          <h2 className="text-fluid-2xl sm:text-fluid-3xl md:text-fluid-4xl font-bold">Track Your Progress</h2>
          <p className="text-fluid-base sm:text-fluid-lg text-muted-foreground">
            Monitor your improvement over time with detailed analytics and progress tracking.
          </p>
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-fluid-sm sm:text-fluid-base">Coding Skills</div>
                <div className="text-fluid-sm sm:text-fluid-base text-muted-foreground">85%</div>
              </div>
              <Progress value={85} className="h-2 sm:h-3" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-fluid-sm sm:text-fluid-base">Interview Readiness</div>
                <div className="text-fluid-sm sm:text-fluid-base text-muted-foreground">75%</div>
              </div>
              <Progress value={75} className="h-2 sm:h-3" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-fluid-sm sm:text-fluid-base">Resume Optimization</div>
                <div className="text-fluid-sm sm:text-fluid-base text-muted-foreground">90%</div>
              </div>
              <Progress value={90} className="h-2 sm:h-3" />
            </div>
          </div>
          <div className="pt-4 sm:pt-6">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/dashboard">
                <BarChartIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                View Your Dashboard
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative order-1 lg:order-2">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-3xl opacity-50" />
          <div className="relative bg-background/80 backdrop-blur-sm border rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Your Progress</div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Weekly Improvement</div>
                <div className="text-2xl sm:text-3xl font-bold">+27%</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 p-2 sm:p-3 rounded-lg bg-muted/50">
                  <div className="text-xs sm:text-sm text-muted-foreground">Tests</div>
                  <div className="text-lg sm:text-xl font-semibold">24</div>
                </div>
                <div className="space-y-1 p-2 sm:p-3 rounded-lg bg-muted/50">
                  <div className="text-xs sm:text-sm text-muted-foreground">Hours</div>
                  <div className="text-lg sm:text-xl font-semibold">18</div>
                </div>
                <div className="space-y-1 p-2 sm:p-3 rounded-lg bg-muted/50">
                  <div className="text-xs sm:text-sm text-muted-foreground">Score</div>
                  <div className="text-lg sm:text-xl font-semibold">92%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 lg:px-8 xl:px-10 max-w-[1800px] mx-auto">
        <Alert className="p-4 sm:p-6 lg:p-8 xl:p-10">
          <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
          <AlertTitle className="text-fluid-base sm:text-fluid-lg lg:text-fluid-xl">Pro Tip</AlertTitle>
          <AlertDescription className="text-fluid-sm sm:text-fluid-base lg:text-fluid-lg leading-relaxed">
            Practice mock interviews with our AI interviewer to get real-time feedback on your communication skills and technical knowledge.
          </AlertDescription>
        </Alert>

        <Alert className="p-4 sm:p-6 lg:p-8 xl:p-10">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
          <AlertTitle className="text-fluid-base sm:text-fluid-lg lg:text-fluid-xl">Success Guarantee</AlertTitle>
          <AlertDescription className="text-fluid-sm sm:text-fluid-base lg:text-fluid-lg leading-relaxed">
            95% of our users report improved interview performance within 30 days of using Interview Mentor.
            Your success is our priority!
          </AlertDescription>
        </Alert>
      </section>
    </div>
  );
}

function BarChartIcon(props) {
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
      <rect x="3" y="12" width="6" height="8" rx="1" />
      <rect x="9" y="8" width="6" height="12" rx="1" />
      <rect x="15" y="4" width="6" height="16" rx="1" />
      <path d="M3 8h18" />
    </svg>
  )
}
