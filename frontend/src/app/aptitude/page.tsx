'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { aptitudeAPI } from '@/lib/api';
import { Brain, MessageCircle, Calculator, Code, Play, Clock, BarChart3 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

const iconMap = {
  'brain': Brain,
  'comment-alt': MessageCircle,
  'calculator': Calculator,
  'code': Code,
};

export default function AptitudePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await aptitudeAPI.getCategories();
        setCategories(response.categories);
      } catch (error: any) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);



  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading aptitude categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-12 overflow-x-hidden">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-fluid-3xl sm:text-fluid-4xl md:text-fluid-5xl font-bold">Aptitude Test Categories</h1>
        <p className="text-fluid-base sm:text-fluid-lg text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
          Choose from our comprehensive range of aptitude tests to assess and improve your skills.
          Each category contains multiple tests designed to evaluate different aspects of your abilities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary mr-3 sm:mr-4 flex-shrink-0">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-fluid-xl sm:text-fluid-2xl font-bold">4</p>
              <p className="text-fluid-sm text-muted-foreground">Test Categories</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600 mr-3 sm:mr-4 flex-shrink-0">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-fluid-xl sm:text-fluid-2xl font-bold">5-20</p>
              <p className="text-fluid-sm text-muted-foreground">Minutes per Test</p>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600 mr-3 sm:mr-4 flex-shrink-0">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-fluid-xl sm:text-fluid-2xl font-bold">Instant</p>
              <p className="text-fluid-sm text-muted-foreground">Results & Analysis</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Brain;

          return (
            <Card key={category.id} className="relative overflow-hidden hover:shadow-lg transition-shadow h-full">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-col sm:flex-row">
                  <div
                    className="p-3 sm:p-4 rounded-lg text-white flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  >
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-fluid-lg sm:text-fluid-xl leading-tight">{category.name}</CardTitle>
                    <CardDescription className="mt-1 sm:mt-2 text-fluid-sm sm:text-fluid-base leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Multiple Tests Available</Badge>
                  <Badge variant="outline" className="text-xs">Instant Results</Badge>
                </div>

                <Button asChild className="w-full min-h-[44px]">
                  <Link href={`/aptitude/${category.id}`}>
                    <Play className="mr-2 h-4 w-4" />
                    View Tests
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips Section */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-fluid-lg sm:text-fluid-xl">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
            Test Taking Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-fluid-base">Before You Start:</h4>
              <ul className="space-y-1 text-fluid-sm text-muted-foreground">
                <li>• Find a quiet environment</li>
                <li>• Ensure stable internet connection</li>
                <li>• Read instructions carefully</li>
                <li>• Have a pen and paper ready</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-fluid-base">During the Test:</h4>
              <ul className="space-y-1 text-fluid-sm text-muted-foreground">
                <li>• Manage your time wisely</li>
                <li>• Read questions thoroughly</li>
                <li>• Don't spend too long on one question</li>
                <li>• Trust your first instinct</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
