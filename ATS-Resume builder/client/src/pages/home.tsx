import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useResumeStore } from "@/hooks/use-resume-store";
import { useScreenSize } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Resume } from "@shared/schema";
import { handleDownloadPDF } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const screenSize = useScreenSize();
  const [isCreating, setIsCreating] = useState(false);
  const createResume = useResumeStore(state => state.createResume);
  
  // Fetch resumes
  const { data: resumes, isLoading, isError, refetch } = useQuery<Resume[]>({
    queryKey: ['/api/resumes'],
  });

  // Format date
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleCreateResume = async () => {
    setIsCreating(true);
    try {
      const defaultContent = {
        personalInfo: {
          fullName: "John Smith",
          jobTitle: "Marketing Manager",
          email: "john.smith@email.com",
          phone: "+1 (555) 123-4567",
          location: "New York, NY",
          profileUrl: "https://linkedin.com/in/johnsmith",
        },
        summary: "Results-driven marketing professional with 5+ years of experience in digital marketing, brand management, and campaign optimization. Proven track record of increasing brand awareness and driving revenue growth through innovative marketing strategies.",
        experience: [
          {
            id: uuidv4(),
            company: 'TechCorp Solutions',
            position: 'Senior Marketing Specialist',
            location: 'New York, NY',
            startDate: '2022-01',
            endDate: '',
            current: true,
            description: [
              'Led digital marketing campaigns that increased brand awareness by 40%',
              'Managed social media strategy across multiple platforms with 50K+ followers',
              'Collaborated with cross-functional teams to launch 3 successful product campaigns'
            ],
          },
          {
            id: uuidv4(),
            company: 'Digital Marketing Agency',
            position: 'Marketing Coordinator',
            location: 'New York, NY',
            startDate: '2020-06',
            endDate: '2021-12',
            current: false,
            description: [
              'Developed and executed email marketing campaigns with 25% open rate',
              'Analyzed campaign performance data to optimize marketing strategies',
              'Supported client relationship management and project coordination'
            ],
          }
        ],
        education: [
          {
            id: uuidv4(),
            institution: 'New York University',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Marketing',
            startDate: '2016-09',
            endDate: '2020-05',
            gpa: '3.7',
            description: ['Magna Cum Laude', 'Marketing Club President'],
          }
        ],
        skills: ['Digital Marketing', 'Social Media Management', 'Google Analytics', 'Content Creation', 'Email Marketing', 'SEO/SEM', 'Adobe Creative Suite', 'Project Management'],
        certifications: [],
        projects: [],
        languages: [],
        volunteer: []
      };

      const resumeId = await createResume("Untitled Resume", "stockholm", defaultContent);
      setLocation(`/builder/${resumeId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create a new resume",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className={cn(
            "flex justify-between items-center",
            screenSize === 'mobile' ? "h-14" : "h-16"
          )}>
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className={cn(
                  "text-primary-700",
                  screenSize === 'mobile' ? "h-6 w-6" : "h-8 w-8"
                )} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18H17V16H7V18Z" fill="currentColor"/>
                  <path d="M17 14H7V12H17V14Z" fill="currentColor"/>
                  <path d="M7 10H11V8H7V10Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V5C21 3.34315 19.6569 2 18 2H6ZM5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5Z" fill="currentColor"/>
                </svg>
                <span className={cn(
                  "ml-2 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
                  screenSize === 'mobile' ? "text-lg" : "text-xl"
                )}>AI Resume Builder</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 py-10 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              AI-Powered Resume Builder
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Create professional resumes with advanced ATS optimization powered by AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleCreateResume}
                disabled={isCreating}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isCreating ? (
                  <>
                    <i className="ri-loader-4-line mr-2 animate-spin"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="ri-add-line mr-2"></i>
                    Create New Resume
                  </>
                )}
              </Button>
              <div className="flex items-center text-sm text-slate-500">
                <i className="ri-shield-check-line mr-1 text-green-500"></i>
                ATS Optimized • AI Enhanced • Modern Templates
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-robot-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI-Powered</h3>
              <p className="text-sm text-slate-600">Advanced AI analyzes and optimizes your resume content</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-search-eye-line text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">ATS Optimized</h3>
              <p className="text-sm text-slate-600">Real-time ATS score calculation and optimization suggestions</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-palette-line text-green-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Modern Templates</h3>
              <p className="text-sm text-slate-600">Professional, creative, and minimalist designs</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">My Resumes</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-700 border-r-transparent"></div>
            </div>
          ) : isError ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md">
              <p className="text-red-800">Failed to load resumes. Please try again later.</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : resumes && resumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card key={resume.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{resume.title}</CardTitle>
                    <CardDescription>
                      Last updated: {formatDate(resume.updatedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                        <i className="ri-file-text-line text-xl"></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {(resume.content.personalInfo?.fullName) || "Unnamed Resume"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {resume.content.personalInfo?.jobTitle || "No job title"}
                        </div>
                      </div>
                    </div>
                    
                    {resume.atsScore !== null && (
                      <div className="mt-4 flex items-center">
                        <div className="text-xs text-slate-500">ATS Score:</div>
                        <div className="ml-2 h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              resume.atsScore >= 80 ? 'bg-green-500' : 
                              resume.atsScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${resume.atsScore}%` }}
                          ></div>
                        </div>
                        <div className="ml-2 text-xs font-medium">{resume.atsScore}</div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/builder/${resume.id}`}>
                        <i className="ri-edit-line mr-1"></i>
                        Edit
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <i className="ri-more-2-fill"></i>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDownloadPDF(resume.id, resume.title)}>
                          <i className="ri-download-line mr-2"></i>
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(resume.id)}
                        >
                          <i className="ri-delete-bin-line mr-2"></i>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <i className="ri-file-list-3-line text-slate-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No resumes yet</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Create your first resume to get started. Our AI-powered tools will help you craft the perfect resume.
              </p>
              <Button onClick={handleCreateResume} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <i className="ri-loader-4-line mr-2 animate-spin"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="ri-add-line mr-2"></i>
                    Create Your First Resume
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg className="h-6 w-6 text-primary-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18H17V16H7V18Z" fill="currentColor"/>
                <path d="M17 14H7V12H17V14Z" fill="currentColor"/>
                <path d="M7 10H11V8H7V10Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V5C21 3.34315 19.6569 2 18 2H6ZM5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5Z" fill="currentColor"/>
              </svg>
              <span className="ml-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Resume Builder</span>
            </div>
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
