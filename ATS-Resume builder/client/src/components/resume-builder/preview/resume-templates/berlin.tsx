import { useResumeStore } from "@/hooks/use-resume-store";
import { formatDateRange } from "@/lib/utils";
import { TemplateComponent } from "./index";

export const BerlinTemplate: TemplateComponent = () => {
  const { content } = useResumeStore();
  const { personalInfo, summary, experience, education, skills } = content;

  return (
    <div className="h-full w-full flex flex-col bg-white text-slate-900 overflow-hidden text-xs">
      {/* Header with background */}
      <div className="bg-blue-600 text-white p-4 flex-shrink-0">
        <h1 className="text-lg font-bold leading-tight">{personalInfo.fullName || "Your Name"}</h1>
        <h2 className="text-sm font-medium mt-0.5 text-blue-100 leading-tight">{personalInfo.jobTitle || "Your Job Title"}</h2>

        <div className="flex flex-wrap items-center mt-2 text-xs gap-x-3 gap-y-1">
          {personalInfo.email && (
            <div className="flex items-center">
              <span className="mr-1">✉</span>
              <span className="truncate max-w-[120px]">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <span className="mr-1">☎</span>
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <span className="mr-1">📍</span>
              <span className="truncate max-w-[100px]">{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.profileUrl && (
            <div className="flex items-center">
              <span className="mr-1">🔗</span>
              <span className="truncate max-w-[120px]">{personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left column for skills and education */}
        <div className="w-1/3 bg-slate-50 p-3 overflow-y-auto">
          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-bold text-blue-700 uppercase border-b border-slate-300 pb-1 mb-2">Skills</h3>
              <div className="flex flex-col gap-1">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="text-xs text-slate-700 flex items-start leading-tight"
                  >
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 mr-1.5" style={{ minWidth: '6px', minHeight: '6px' }}></span>
                    <span className="break-words">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-blue-700 uppercase border-b border-slate-300 pb-1 mb-2">Education</h3>
              <div className="flex flex-col gap-2">
                {education.map((edu, index) => (
                  <div key={edu.id || index}>
                    <h4 className="text-xs font-semibold leading-tight">{edu.degree}</h4>
                    <p className="text-xs text-blue-700 leading-tight">{edu.institution}</p>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                      {edu.gpa && <div>GPA: {edu.gpa}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column for summary and experience */}
        <div className="w-2/3 p-3 overflow-y-auto">
          {/* Summary */}
          {summary && (
            <div className="mb-3">
              <h3 className="text-xs font-bold text-blue-700 uppercase border-b border-slate-300 pb-1 mb-2">
                Professional Summary
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-blue-700 uppercase border-b border-slate-300 pb-1 mb-2">
                Work Experience
              </h3>

              <div className="flex flex-col gap-3">
                {experience.map((exp, index) => (
                  <div key={exp.id || index}>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-semibold leading-tight flex-1 min-w-0 pr-2">{exp.position}</h4>
                      <span className="text-xs text-slate-500 whitespace-nowrap" style={{ flexShrink: 0 }}>
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 leading-tight">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    <ul className="mt-0.5 text-xs text-slate-700 list-disc list-outside ml-3">
                      {exp.description.slice(0, 3).map((desc, descIndex) => (
                        <li key={descIndex} className="leading-tight mb-0.5">{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
