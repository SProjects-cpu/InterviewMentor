import { useState, useEffect } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { useScreenSize } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Template } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function TemplateSelector() {
  const { template, setTemplate, availableTemplates } = useResumeStore();
  const screenSize = useScreenSize();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);

  useEffect(() => {
    let result = availableTemplates;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(t => t.category === selectedCategory);
    }

    setFilteredTemplates(result);
  }, [searchTerm, selectedCategory, availableTemplates]);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className={cn(
        screenSize === 'mobile' ? "p-3" : "p-4 lg:p-6"
      )}>
        <h2 className={cn(
          "font-semibold text-gray-900",
          screenSize === 'mobile' ? "text-lg mb-4" : "text-xl mb-6"
        )}>Choose Template</h2>

        {/* Filter Controls */}
        <div className={cn(screenSize === 'mobile' ? "mb-3" : "mb-4")}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search templates"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full text-sm",
                screenSize === 'mobile' ? "px-3 py-2" : "px-4 py-2"
              )}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i className="ri-search-line text-slate-400"></i>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className={cn(
          "flex flex-wrap gap-2",
          screenSize === 'mobile' ? "mb-4" : "mb-6"
        )}>
          <Button
            type="button"
            size={screenSize === 'mobile' ? 'sm' : 'sm'}
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={cn(
              "rounded-full",
              screenSize === 'mobile' ? "text-xs px-3 py-1" : "text-sm px-4 py-2"
            )}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Button>
          <Button
            type="button"
            size={screenSize === 'mobile' ? 'sm' : 'sm'}
            variant={selectedCategory === "modern" ? "default" : "outline"}
            className={cn(
              "rounded-full",
              screenSize === 'mobile' ? "text-xs px-3 py-1" : "text-sm px-4 py-2"
            )}
            onClick={() => setSelectedCategory("modern")}
          >
            Modern
          </Button>
          <Button
            type="button"
            size={screenSize === 'mobile' ? 'sm' : 'sm'}
            variant={selectedCategory === "professional" ? "default" : "outline"}
            className={cn(
              "rounded-full",
              screenSize === 'mobile' ? "text-xs px-3 py-1" : "text-sm px-4 py-2"
            )}
            onClick={() => setSelectedCategory("professional")}
          >
            Professional
          </Button>
          <Button
            type="button"
            size={screenSize === 'mobile' ? 'sm' : 'sm'}
            variant={selectedCategory === "creative" ? "default" : "outline"}
            className={cn(
              "rounded-full",
              screenSize === 'mobile' ? "text-xs px-3 py-1" : "text-sm px-4 py-2"
            )}
            onClick={() => setSelectedCategory("creative")}
          >
            Creative
          </Button>
        </div>

        {/* Template Grid */}
        <div className={cn(
          "grid gap-3",
          screenSize === 'mobile'
            ? "grid-cols-2"
            : screenSize === 'tablet'
            ? "grid-cols-3"
            : "grid-cols-2 xl:grid-cols-3"
        )}>
          {filteredTemplates.map((t) => (
            <Card
              key={t.id}
              className={cn(
                "relative group cursor-pointer overflow-hidden transition-all duration-200 flex flex-col",
                template === t.id
                  ? "ring-2 ring-primary-500 shadow-md"
                  : "hover:shadow-md"
              )}
              onClick={() => setTemplate(t.id)}
            >
              <div className="p-2 flex flex-col h-full">
                {/* Template preview */}
                <div
                  className={cn(
                    "aspect-[8.5/11] rounded-md overflow-hidden border transition-all flex-shrink-0",
                    template === t.id
                      ? "border-primary-500"
                      : "border-slate-200"
                  )}
                >
                  {/* Template image with specific styling for each template */}
                  <div className={cn(
                    "w-full h-full relative overflow-hidden",
                    t.id === "stockholm" && "bg-gradient-to-br from-slate-50 to-slate-100",
                    t.id === "berlin" && "bg-gradient-to-br from-blue-50 to-slate-100",
                    t.id === "tokyo" && "bg-gradient-to-br from-red-50 to-slate-100",
                    t.id === "modern" && "bg-gradient-to-br from-blue-50 via-purple-50 to-white",
                    t.id === "minimalist" && "bg-white",
                    t.id === "creative" && "bg-gradient-to-br from-teal-50 via-white to-emerald-50"
                  )}>
                    {/* Show a mini preview of the template layout */}
                    <div className="p-2 h-full flex flex-col">
                      {/* Header section */}
                      <div className={cn(
                        "w-full mb-2 rounded-sm",
                        t.id === "stockholm" && "h-8 bg-slate-300",
                        t.id === "berlin" && "h-8 bg-blue-300",
                        t.id === "tokyo" && "h-8 bg-red-300",
                        t.id === "modern" && "h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg",
                        t.id === "minimalist" && "h-6 border-b-2 border-slate-900",
                        t.id === "creative" && "h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg"
                      )}></div>

                      {/* Content section */}
                      <div className="flex flex-1 gap-2">
                        {/* Sidebar for certain templates */}
                        {(t.id === "berlin" || t.id === "creative") && (
                          <div className={cn(
                            "w-1/3 h-full rounded-sm",
                            t.id === "berlin" && "bg-blue-200",
                            t.id === "creative" && "bg-gradient-to-b from-teal-400 to-emerald-400"
                          )}></div>
                        )}

                        {/* Main content */}
                        <div className={cn(
                          "flex-1 flex flex-col gap-1",
                          t.id === "tokyo" && "items-center",
                          t.id === "minimalist" && "gap-2"
                        )}>
                          <div className={cn(
                            "w-full h-3 rounded-sm",
                            t.id === "stockholm" && "bg-slate-200",
                            t.id === "berlin" && "bg-blue-200",
                            t.id === "tokyo" && "bg-red-200 w-2/3",
                            t.id === "modern" && "bg-gradient-to-r from-blue-200 to-purple-200",
                            t.id === "minimalist" && "bg-slate-300 h-2",
                            t.id === "creative" && "bg-gradient-to-r from-teal-300 to-emerald-300"
                          )}></div>
                          <div className={cn(
                            "w-full h-3 rounded-sm",
                            t.id === "stockholm" && "bg-slate-200",
                            t.id === "berlin" && "bg-blue-200",
                            t.id === "tokyo" && "bg-red-200 w-2/3",
                            t.id === "modern" && "bg-slate-200",
                            t.id === "minimalist" && "bg-slate-200 h-2",
                            t.id === "creative" && "bg-slate-200"
                          )}></div>
                          <div className={cn(
                            "w-full h-3 rounded-sm",
                            t.id === "stockholm" && "bg-slate-200",
                            t.id === "berlin" && "bg-blue-200",
                            t.id === "tokyo" && "bg-indigo-200 w-2/3",
                            t.id === "modern" && "bg-slate-200",
                            t.id === "minimalist" && "bg-slate-200 h-2",
                            t.id === "creative" && "bg-slate-200"
                          )}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template name and action - Always visible at bottom */}
                <div className="mt-2 flex items-center justify-between flex-shrink-0 min-h-[2rem]">
                  <p className="text-sm font-medium text-slate-900 truncate pr-2">{t.name}</p>

                  {/* Selected status or apply button */}
                  {template === t.id ? (
                    <div className="flex items-center text-primary-500 text-sm font-medium flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                      Applied
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs flex-shrink-0"
                    >
                      Apply
                    </Button>
                  )}
                </div>
              </div>
              
              {/* PRO tag */}
              {t.isPremium && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-primary-100 text-primary-800">
                    PRO
                  </span>
                </div>
              )}
            </Card>
          ))}

          {/* Show a message if no templates match the filter */}
          {filteredTemplates.length === 0 && (
            <div className="col-span-2 text-center py-8">
              <p className="text-sm text-slate-500">No templates found matching your criteria.</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
