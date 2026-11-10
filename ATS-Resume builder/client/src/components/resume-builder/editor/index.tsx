import { useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { useScreenSize } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PersonalInfoForm } from "./personal-info";
import { SummaryForm } from "./summary";
import { ExperienceForm } from "./experience";
import { EducationForm } from "./education";
import { SkillsForm } from "./skills";
import { CertificationsForm } from "./certifications";
import { ProjectsForm } from "./projects";
import { LanguagesForm } from "./languages";
import { VolunteerForm } from "./volunteer";
import { OptimizationPanel } from "../resume-tips/optimization-panel";
import { JobDescriptionAnalyzer } from "../job-description-analyzer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ResumeEditor() {
  const {
    content,
    isModified,
    saveResume,
    isSaving,
    autoSaveEnabled,
    toggleAutoSave,
    addCertification,
    addProject,
    addLanguage,
    addVolunteer
  } = useResumeStore();
  const screenSize = useScreenSize();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isSectionCollapsed = (section: string) => {
    return !!collapsedSections[section];
  };

  const renderSectionHeader = (title: string, icon: string, section: string) => (
    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 rounded-t-lg flex items-center justify-between">
      <h3 className="text-sm font-medium text-slate-900 flex items-center">
        <i className={`${icon} mr-2 text-slate-500`}></i>
        {title}
      </h3>
      <button 
        className="text-slate-400 hover:text-slate-500"
        onClick={() => toggleSection(section)}
      >
        <i className={`ri-arrow-${isSectionCollapsed(section) ? 'down' : 'up'}-s-line`}></i>
      </button>
    </div>
  );

  return (
    <div className={cn(
      "w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col",
      screenSize === 'mobile' ? "h-[calc(100vh-12rem)]" : "h-[calc(100vh-8rem)]"
    )}>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
          <h2 className={cn(
            "font-semibold text-gray-900 truncate",
            screenSize === 'mobile' ? "text-lg" : "text-xl"
          )}>Edit Resume</h2>
          {screenSize !== 'mobile' && (
            <div className="flex items-center space-x-2">
              {autoSaveEnabled && (
                <div className="flex items-center text-xs text-green-600">
                  <i className="ri-check-line mr-1"></i>
                  Auto-save enabled
                </div>
              )}
              {isModified && !isSaving && (
                <div className="flex items-center text-xs text-amber-600">
                  <i className="ri-time-line mr-1"></i>
                  Unsaved changes
                </div>
              )}
              {isSaving && (
                <div className="flex items-center text-xs text-blue-600">
                  <i className="ri-loader-4-line mr-1 animate-spin"></i>
                  Saving...
                </div>
              )}
            </div>
          )}
        </div>
        <div className={cn(
          "flex",
          screenSize === 'mobile' ? "space-x-1" : "space-x-2"
        )}>
          <Button
            variant="ghost"
            size={screenSize === 'mobile' ? 'sm' : 'default'}
            onClick={toggleAutoSave}
            className={cn(
              screenSize === 'mobile' ? "text-xs px-2" : "text-sm"
            )}
          >
            <i className={`${autoSaveEnabled ? 'ri-toggle-line' : 'ri-toggle-fill'} ${screenSize === 'mobile' ? '' : 'mr-1'}`}></i>
            {screenSize !== 'mobile' && 'Auto-save'}
          </Button>
          <Button
            variant="outline"
            size={screenSize === 'mobile' ? 'sm' : 'default'}
            onClick={() => saveResume()}
            disabled={!isModified || isSaving}
            className={screenSize === 'mobile' ? "text-xs px-2" : ""}
          >
            {isSaving ? (
              <>
                <i className="ri-loader-4-line mr-1 animate-spin"></i>
                {screenSize === 'mobile' ? '' : 'Saving...'}
              </>
            ) : (
              <>
                <i className="ri-save-line mr-1"></i>
                {screenSize === 'mobile' ? '' : 'Save'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor Content with Sections */}
      <div className={cn(
        "flex-1 overflow-y-auto scroll-smooth",
        screenSize === 'mobile' ? "p-3 space-y-4" : "p-4 space-y-6"
      )}>
        {/* Personal Information Section */}
        <Card>
          {renderSectionHeader("Personal Information", "ri-user-line", "personal")}
          {!isSectionCollapsed("personal") && <PersonalInfoForm />}
        </Card>

        {/* Professional Summary Section */}
        <Card>
          {renderSectionHeader("Professional Summary", "ri-file-text-line", "summary")}
          {!isSectionCollapsed("summary") && <SummaryForm />}
        </Card>
        
        {/* Experience Section */}
        <Card>
          <CardHeader className="px-4 py-3 bg-slate-50 rounded-t-lg flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-900 flex items-center">
              <i className="ri-briefcase-line mr-2 text-slate-500"></i>
              Work Experience
            </CardTitle>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => useResumeStore.getState().addExperience()}
                className="mr-3 h-auto py-1 px-1.5 text-primary-700 hover:text-primary-800 hover:bg-transparent"
              >
                <i className="ri-add-line mr-1"></i>
                Add
              </Button>
              <button
                className="text-slate-400 hover:text-slate-500"
                onClick={() => toggleSection("experience")}
              >
                <i className={`ri-arrow-${isSectionCollapsed("experience") ? 'down' : 'up'}-s-line`}></i>
              </button>
            </div>
          </CardHeader>

          {!isSectionCollapsed("experience") && (
            <CardContent className="p-0">
              <ExperienceForm />
            </CardContent>
          )}
        </Card>

        {/* Education Section */}
        <Card>
          <CardHeader className="px-4 py-3 bg-slate-50 rounded-t-lg flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-900 flex items-center">
              <i className="ri-graduation-cap-line mr-2 text-slate-500"></i>
              Education
            </CardTitle>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => useResumeStore.getState().addEducation()}
                className="mr-3 h-auto py-1 px-1.5 text-primary-700 hover:text-primary-800 hover:bg-transparent"
              >
                <i className="ri-add-line mr-1"></i>
                Add
              </Button>
              <button
                className="text-slate-400 hover:text-slate-500"
                onClick={() => toggleSection("education")}
              >
                <i className={`ri-arrow-${isSectionCollapsed("education") ? 'down' : 'up'}-s-line`}></i>
              </button>
            </div>
          </CardHeader>

          {!isSectionCollapsed("education") && (
            <CardContent className="p-0">
              <EducationForm />
            </CardContent>
          )}
        </Card>
        
        {/* Skills Section */}
        <Card>
          <CardHeader className="px-4 py-3 bg-slate-50 rounded-t-lg flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-900 flex items-center">
              <i className="ri-tools-line mr-2 text-slate-500"></i>
              Skills
            </CardTitle>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => useResumeStore.getState().suggestSkills()}
                className="mr-3 h-auto py-1 px-1.5 text-primary-700 hover:text-primary-800 hover:bg-transparent"
              >
                <i className="ri-magic-line mr-1"></i>
                AI Suggest
              </Button>
              <button
                className="text-slate-400 hover:text-slate-500"
                onClick={() => toggleSection("skills")}
              >
                <i className={`ri-arrow-${isSectionCollapsed("skills") ? 'down' : 'up'}-s-line`}></i>
              </button>
            </div>
          </CardHeader>

          {!isSectionCollapsed("skills") && (
            <CardContent className="p-0">
              <SkillsForm />
            </CardContent>
          )}
        </Card>

        {/* Certifications Section */}
        {content.certifications.length > 0 && (
          <Card>
            {renderSectionHeader("Certifications", "ri-award-line", "certifications")}
            {!isSectionCollapsed("certifications") && <CertificationsForm />}
          </Card>
        )}

        {/* Projects Section */}
        {content.projects.length > 0 && (
          <Card>
            {renderSectionHeader("Projects", "ri-git-repository-line", "projects")}
            {!isSectionCollapsed("projects") && <ProjectsForm />}
          </Card>
        )}

        {/* Languages Section */}
        {content.languages.length > 0 && (
          <Card>
            {renderSectionHeader("Languages", "ri-translate-2", "languages")}
            {!isSectionCollapsed("languages") && <LanguagesForm />}
          </Card>
        )}

        {/* Volunteer Experience Section */}
        {content.volunteer.length > 0 && (
          <Card>
            {renderSectionHeader("Volunteer Experience", "ri-user-heart-line", "volunteer")}
            {!isSectionCollapsed("volunteer") && <VolunteerForm />}
          </Card>
        )}

        {/* Job Description Analyzer */}
        <Card>
          {renderSectionHeader("Job Description Analyzer", "ri-search-eye-line", "jobAnalyzer")}
          {!isSectionCollapsed("jobAnalyzer") && (
            <CardContent>
              <JobDescriptionAnalyzer />
            </CardContent>
          )}
        </Card>

        {/* Resume Optimization Panel */}
        <Card>
          {renderSectionHeader("Resume Optimization", "ri-line-chart-line", "optimization")}
          {!isSectionCollapsed("optimization") && <OptimizationPanel />}
        </Card>
        
        {/* Add Section Button */}
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <i className="ri-add-line mr-2"></i>
                Add Section
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={addCertification}>
                <i className="ri-award-line mr-2"></i> Certifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={addProject}>
                <i className="ri-git-repository-line mr-2"></i> Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={addLanguage}>
                <i className="ri-translate-2 mr-2"></i> Languages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={addVolunteer}>
                <i className="ri-user-heart-line mr-2"></i> Volunteer Experience
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
