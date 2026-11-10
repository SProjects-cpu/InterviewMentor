import { useState, useEffect } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { useScreenSize } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StockholmTemplate } from "./resume-templates/stockholm";
import { BerlinTemplate } from "./resume-templates/berlin";
import { TokyoTemplate } from "./resume-templates/tokyo";
import { ModernTemplate } from "./resume-templates/modern";
import { MinimalistTemplate } from "./resume-templates/minimalist";
import { CreativeTemplate } from "./resume-templates/creative";
import { ATSTipsModal } from "@/components/resume-builder/ats-tips-modal";
import { ATSScore } from "@/components/resume-builder/ats-score";
import { handleDownloadPDF } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

export function ResumePreview() {
  const {
    template,
    resumeId,
    title,
    atsScore,
    atsSuggestions,
    atsKeywordMatches,
    atsMissingKeywords,
    calculateATSScore
  } = useResumeStore();
  const screenSize = useScreenSize();
  const [fullPreview, setFullPreview] = useState(false);
  const [showAtsTips, setShowAtsTips] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(template);

  // Force re-render when template changes
  useEffect(() => {
    if (currentTemplate !== template) {
      setCurrentTemplate(template);
    }
  }, [template, currentTemplate]);

  const handleFullPreview = () => {
    setFullPreview(true);
  };

  const handleShowAtsTips = () => {
    setShowAtsTips(true);
  };
  
  const handleDownloadPDFClick = () => {
    if (resumeId) {
      handleDownloadPDF(resumeId, title);
    }
  };

  const renderTemplate = () => {
    // Add key prop to force re-render when template changes
    switch (template) {
      case "berlin":
        return <BerlinTemplate key={`template-berlin-${currentTemplate}`} />;
      case "tokyo":
        return <TokyoTemplate key={`template-tokyo-${currentTemplate}`} />;
      case "modern":
        return <ModernTemplate key={`template-modern-${currentTemplate}`} />;
      case "minimalist":
        return <MinimalistTemplate key={`template-minimalist-${currentTemplate}`} />;
      case "creative":
        return <CreativeTemplate key={`template-creative-${currentTemplate}`} />;
      case "stockholm":
      default:
        return <StockholmTemplate key={`template-stockholm-${currentTemplate}`} />;
    }
  };

  return (
    <>
      <div className={cn(
        "w-full bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col",
        screenSize === 'mobile' ? "h-[calc(100vh-12rem)]" : "h-[calc(100vh-8rem)]"
      )}>
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between flex-shrink-0">
          <h2 className={cn(
            "font-semibold text-gray-900",
            screenSize === 'mobile' ? "text-lg" : "text-xl"
          )}>Resume Preview</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size={screenSize === 'mobile' ? 'sm' : 'sm'}
              onClick={handleFullPreview}
            >
              <i className="ri-eye-line mr-1"></i>
              {screenSize === 'mobile' ? 'Full' : 'Full Preview'}
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className={cn(
          "flex-1 flex justify-center overflow-auto",
          screenSize === 'mobile' ? "p-2" : "p-4 lg:p-6"
        )}>
          <div
            className={cn(
              "bg-white shadow-lg mx-auto relative resume-preview-content overflow-hidden",
              screenSize === 'mobile'
                ? "w-full min-h-[500px]"
                : "w-full max-w-[612px] min-h-[792px]"
            )}
            style={{
              aspectRatio: screenSize === 'mobile' ? "auto" : "8.5/11"
            }}
          >
            <div className="w-full h-full overflow-hidden">
              {renderTemplate()}
            </div>

            {atsScore !== null && (
              <div
                className={cn(
                  "absolute cursor-pointer ats-score-overlay",
                  screenSize === 'mobile' ? "top-1 right-1" : "top-2 right-2"
                )}
                onClick={handleShowAtsTips}
              >
                <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-sm rounded-md p-1">
                  <ATSScore
                    score={atsScore}
                    keywordMatches={atsKeywordMatches}
                    missingKeywords={atsMissingKeywords}
                    suggestions={atsSuggestions}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom controls */}
        <div className={cn(
          "sticky bottom-0 bg-slate-100 border-t border-slate-200 flex justify-center",
          screenSize === 'mobile'
            ? "p-2 space-x-2 flex-wrap gap-2"
            : "p-3 space-x-3"
        )}>
          <Button
            variant="outline"
            size={screenSize === 'mobile' ? 'sm' : 'default'}
            onClick={() => calculateATSScore()}
            className={screenSize === 'mobile' ? "flex-1 min-w-0" : ""}
          >
            <i className="ri-refresh-line mr-1"></i>
            {screenSize === 'mobile' ? 'ATS' : 'Update ATS Score'}
          </Button>
          <Button
            variant="default"
            size={screenSize === 'mobile' ? 'sm' : 'default'}
            onClick={handleDownloadPDFClick}
            disabled={!resumeId}
            className={screenSize === 'mobile' ? "flex-1 min-w-0" : ""}
          >
            <i className="ri-file-pdf-line mr-1"></i>
            {screenSize === 'mobile' ? 'PDF' : 'Export PDF'}
          </Button>
        </div>
      </div>

      {/* ATS Tips Modal */}
      <ATSTipsModal 
        open={showAtsTips} 
        onOpenChange={setShowAtsTips} 
      />

      {/* Full Preview Modal */}
      <Dialog open={fullPreview} onOpenChange={setFullPreview}>
        <DialogContent className={cn(
          "max-h-screen overflow-y-auto",
          screenSize === 'mobile'
            ? "w-[95vw] max-w-[95vw] h-[90vh]"
            : "sm:max-w-4xl"
        )}>
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>

          <div className={cn(
            "flex justify-center bg-slate-100 rounded-lg",
            screenSize === 'mobile' ? "p-2" : "p-4"
          )}>
            <div
              className={cn(
                "print-preview-content bg-white shadow-lg relative",
                screenSize === 'mobile'
                  ? "w-full"
                  : "w-full max-w-[816px]"
              )}
              style={{
                aspectRatio: screenSize === 'mobile' ? "auto" : "8.5/11"
              }}
            >
              {renderTemplate()}
            </div>
          </div>

          <DialogFooter className={cn(
            screenSize === 'mobile'
              ? "flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2"
              : ""
          )}>
            <Button
              variant="outline"
              onClick={() => setFullPreview(false)}
              className={screenSize === 'mobile' ? "w-full sm:w-auto" : ""}
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={handleDownloadPDFClick}
              disabled={!resumeId}
              className={screenSize === 'mobile' ? "w-full sm:w-auto" : ""}
            >
              <i className="ri-file-pdf-line mr-1"></i>
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
