import { useResumeStore } from "@/hooks/use-resume-store";
import { formatDateRange } from "@/lib/utils";
import { TemplateComponent } from "./index";

export const MinimalistTemplate: TemplateComponent = () => {
  const { content } = useResumeStore();
  const { personalInfo, summary, experience, education, skills } = content;

  return (
    <div className="p-4 h-full w-full flex flex-col text-slate-900 bg-white overflow-hidden text-xs">
      {/* Header - Clean and minimal */}
      <div className="border-b-2 border-slate-900 pb-3 mb-3 flex-shrink-0">
        <h1 className="text-lg font-light tracking-wide text-slate-900 mb-1 leading-tight">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <h2 className="text-sm font-normal text-slate-600 mb-2 leading-tight">
          {personalInfo.jobTitle || "Your Job Title"}
        </h2>

        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
          {personalInfo.email && (
            <span className="break-all">{personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span className="break-all">{personalInfo.location}</span>
          )}
          {personalInfo.profileUrl && (
            <span className="break-all">{personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
          )}
        </div>
      </div>
      
      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {/* Summary - Clean typography */}
        {summary && (
          <div>
            <h3 className="text-xs uppercase tracking-widest font-medium text-slate-900 mb-2">
              Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {/* Experience - Minimal design */}
        {experience.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest font-medium text-slate-900 mb-2">
              Experience
            </h3>

            <div className="flex flex-col gap-2">
              {experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-medium text-slate-900 leading-tight">{exp.position}</h4>
                      <p className="text-xs text-slate-600 leading-tight">{exp.company}</p>
                    </div>
                    <div className="text-right" style={{ flexShrink: 0 }}>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                      {exp.location && (
                        <p className="text-xs text-slate-500">{exp.location}</p>
                      )}
                    </div>
                  </div>
                  <ul className="text-xs text-slate-700 mt-1 list-disc list-outside ml-3">
                    {exp.description.slice(0, 3).map((desc, descIndex) => (
                      <li className="leading-tight mb-0.5" key={descIndex}>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education - Clean layout */}
        {education.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest font-medium text-slate-900 mb-2">
              Education
            </h3>

            <div className="flex flex-col gap-1">
              {education.map((edu, index) => (
                <div className="flex justify-between items-start" key={edu.id || index}>
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-xs font-medium text-slate-900 leading-tight">{edu.degree}</h4>
                    <p className="text-xs text-slate-600 leading-tight">{edu.institution}</p>
                  </div>
                  <div className="text-right" style={{ flexShrink: 0 }}>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                    </span>
                    {edu.gpa && (
                      <p className="text-xs text-slate-500">GPA: {edu.gpa}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills - Simple list */}
        {skills.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest font-medium text-slate-900 mb-2">
              Skills
            </h3>

            <div className="text-xs text-slate-700 leading-relaxed">
              {skills.join(" • ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
