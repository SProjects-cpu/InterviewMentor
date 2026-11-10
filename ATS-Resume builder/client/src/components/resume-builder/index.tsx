import { useEffect, useState } from "react";
import { TemplateSelector } from "./templates";
import { ResumeEditor } from "./editor";
import { ResumePreview } from "./preview";
import { ResumeDashboard } from "./dashboard";
import { useResumeStore } from "@/hooks/use-resume-store";
import { useScreenSize } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResumeBuilderProps {
  resumeId?: number;
}

export function ResumeBuilder({ resumeId }: ResumeBuilderProps) {
  const { loadResume, loadTemplates, calculateATSScore, isLoading } = useResumeStore();
  const screenSize = useScreenSize();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    // Load templates
    loadTemplates();

    // Load resume if ID is provided
    if (resumeId) {
      loadResume(resumeId).then(() => {
        // Calculate ATS score after loading resume
        calculateATSScore();
      });
    }
  }, [resumeId, loadResume, loadTemplates, calculateATSScore]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary-700 border-r-transparent mb-4"></div>
          <p className="text-slate-700">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        {/* Template Selector - Mobile */}
        <div className="block lg:hidden mb-4">
          <TemplateSelector />
        </div>

        {/* Dashboard */}
        <ResumeDashboard />

        {/* Main Content */}
        {screenSize === 'mobile' ? (
          // Mobile: Tab-based layout with ShadCN Tabs
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'preview')} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="editor" className="flex items-center">
                <i className="ri-edit-line mr-2"></i>
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center">
                <i className="ri-eye-line mr-2"></i>
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-0">
              <ResumeEditor />
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <ResumePreview />
            </TabsContent>
          </Tabs>
        ) : (
          // Tablet and Desktop: Grid layout
          <div className={cn(
            "grid gap-4 lg:gap-6",
            screenSize === 'tablet'
              ? "grid-cols-1 xl:grid-cols-2"
              : "grid-cols-1 lg:grid-cols-12"
          )}>
            {/* Left Sidebar - Template Selector (Desktop only) */}
            {screenSize === 'desktop' && (
              <div className="lg:col-span-3">
                <div className="sticky top-6">
                  <TemplateSelector />
                </div>
              </div>
            )}

            {/* Editor Section */}
            <div className={cn(
              screenSize === 'tablet'
                ? "xl:col-span-1"
                : "lg:col-span-5"
            )}>
              <ResumeEditor />
            </div>

            {/* Preview Section */}
            <div className={cn(
              screenSize === 'tablet'
                ? "xl:col-span-1"
                : "lg:col-span-4"
            )}>
              <div className="sticky top-6">
                <ResumePreview />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
