import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ATSScore } from "@/components/resume-builder/ats-score";
import { useResumeStore } from "@/hooks/use-resume-store";
import { useScreenSize } from "@/hooks/use-mobile";
import { handleDownloadPDF } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Header() {
  const screenSize = useScreenSize();
  const {
    resumeId,
    title,
    atsScore,
    saveResume,
    isModified,
    isSaving
  } = useResumeStore();

  const handleExportPDF = () => {
    if (resumeId) {
      handleDownloadPDF(resumeId, title);
    }
  };
  


  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className={cn(
          "flex justify-between items-center",
          screenSize === 'mobile' ? "h-14" : "h-16"
        )}>
          <div className="flex items-center min-w-0 flex-1">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
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
                )}>
                  {screenSize === 'mobile' ? 'AI Resume' : 'AI Resume Builder'}
                </span>
              </div>
            </Link>
          </div>
          <div className={cn(
            "flex items-center",
            screenSize === 'mobile' ? "space-x-1" : "space-x-4"
          )}>
            {screenSize !== 'mobile' && (
              <div className="hidden md:block">
                {atsScore !== null && <ATSScore score={atsScore} />}
              </div>
            )}

            {resumeId && (
              <>
                <Button
                  variant="outline"
                  size="sm"
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
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleExportPDF}
                  className={screenSize === 'mobile' ? "text-xs px-2" : ""}
                >
                  <i className="ri-download-line mr-1"></i>
                  {screenSize === 'mobile' ? 'PDF' : 'Export PDF'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
