'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { aptitudeAPI } from '@/lib/api';
// Authentication removed
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  FileQuestion, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Brain,
  MessageCircle,
  Calculator,
  Code
} from 'lucide-react';

interface Test {
  id: string;
  name: string;
  description: string;
  questions: number;
  time: number;
  difficulty: string;
}

interface Category {
  id: string;
  name: string;
  tests: Test[];
}

const iconMap = {
  'logical': Brain,
  'verbal': MessageCircle,
  'quantitative': Calculator,
  'technical': Code,
};

const difficultyColors = {
  'Easy': 'bg-green-100 text-green-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Hard': 'bg-red-100 text-red-800',
};

export default function CategoryTestsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Authentication removed

  useEffect(() => {
    const fetchCategoryTests = async () => {
      try {
        const response = await aptitudeAPI.getCategoryTests(categoryId);
        setCategory(response.category);
      } catch (error: any) {
        setError('Failed to load category tests');
        console.error('Error fetching category tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryTests();
  }, [categoryId]);

  const handleStartTest = async (testId: string) => {
    try {
      const response = await aptitudeAPI.startTest(testId);
      router.push(`/aptitude/test/${response.session_id}`);
    } catch (error: any) {
      console.error('Error starting test:', error);
      // Handle error - maybe show a toast notification
    }
  };

  // Authentication check removed - all users can access tests

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading tests...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Tests</h1>
        <p className="text-muted-foreground mb-4">{error || 'Category not found'}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/aptitude">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[categoryId as keyof typeof iconMap] || Brain;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/aptitude">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary text-primary-foreground">
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">Choose a test to begin your assessment</p>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FileQuestion className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{category.tests.length}</p>
              <p className="text-sm text-muted-foreground">Available Tests</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.min(...category.tests.map(t => t.time))}-{Math.max(...category.tests.map(t => t.time))}
              </p>
              <p className="text-sm text-muted-foreground">Minutes Range</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">Instant</p>
              <p className="text-sm text-muted-foreground">Results & Analysis</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {category.tests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{test.name}</CardTitle>
                  <CardDescription className="text-base">
                    {test.description}
                  </CardDescription>
                </div>
                <Badge 
                  className={difficultyColors[test.difficulty as keyof typeof difficultyColors]}
                  variant="secondary"
                >
                  {test.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Test Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FileQuestion className="h-4 w-4 text-muted-foreground" />
                  <span>{test.questions} Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{test.time} Minutes</span>
                </div>
              </div>

              {/* Progress Indicator (placeholder) */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span className="text-muted-foreground">Not Started</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => handleStartTest(test.id)}
                className="w-full"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Test Preparation Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Before Starting:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Ensure you have a stable internet connection</li>
                <li>• Find a quiet, distraction-free environment</li>
                <li>• Have a pen and paper ready for calculations</li>
                <li>• Read all instructions carefully</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">During the Test:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Manage your time effectively</li>
                <li>• Read each question thoroughly</li>
                <li>• Don't spend too much time on difficult questions</li>
                <li>• Review your answers if time permits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
