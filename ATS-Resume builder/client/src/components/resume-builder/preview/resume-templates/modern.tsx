import { useResumeStore } from "@/hooks/use-resume-store";
import { formatDateRange } from "@/lib/utils";
import { TemplateComponent } from "./index";

export const ModernTemplate: TemplateComponent = () => {
  const { content } = useResumeStore();
  const { personalInfo, summary, experience, education, skills } = content;

  return (
    <div className="p-4 h-full w-full flex flex-col bg-gradient-to-br from-slate-50 to-white text-slate-900 overflow-hidden text-xs">
      {/* Header with modern gradient */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg mb-3 shadow-lg flex-shrink-0">
        <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
        <div className="relative z-10">
          <h1 className="text-lg font-bold mb-1 leading-tight">{personalInfo.fullName || "Your Name"}</h1>
          <h2 className="text-sm font-light opacity-90 mb-2 leading-tight">{personalInfo.jobTitle || "Your Job Title"}</h2>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {personalInfo.email && (
              <div className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mt-1 mr-1.5 opacity-75" style={{ minWidth: '6px', minHeight: '6px' }}></span>
                <span className="break-all leading-tight">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mt-1 mr-1.5 opacity-75" style={{ minWidth: '6px', minHeight: '6px' }}></span>
                <span className="leading-tight">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mt-1 mr-1.5 opacity-75" style={{ minWidth: '6px', minHeight: '6px' }}></span>
                <span className="break-all leading-tight">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.profileUrl && (
              <div className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mt-1 mr-1.5 opacity-75" style={{ minWidth: '6px', minHeight: '6px' }}></span>
                <span className="break-all leading-tight">{personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {/* Summary with modern styling */}
        {summary && (
          <div>
            <div className="flex items-center mb-1">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-2"></div>
              <h3 className="text-xs font-semibold text-slate-800">Professional Summary</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-3 border-l-2 border-slate-200">
              {summary}
            </p>
          </div>
        )}

        {/* Experience with modern cards */}
        {experience.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-2"></div>
              <h3 className="text-xs font-semibold text-slate-800">Work Experience</h3>
            </div>

            <div className="flex flex-col gap-2">
              {experience.map((exp, index) => (
                <div className="bg-white rounded p-2 shadow-sm border border-slate-200" key={exp.id || index}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-semibold text-slate-900 leading-tight">{exp.position}</h4>
                      <p className="text-xs font-medium text-blue-600 leading-tight">{exp.company}</p>
                      {exp.location && <p className="text-xs text-slate-500 leading-tight">{exp.location}</p>}
                    </div>
                    <span className="text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap" style={{ flexShrink: 0 }}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-700 list-disc list-outside ml-3">
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

        {/* Education with modern styling */}
        {education.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-2"></div>
              <h3 className="text-xs font-semibold text-slate-800">Education</h3>
            </div>

            <div className="flex flex-col gap-1">
              {education.map((edu, index) => (
                <div className="bg-white rounded p-2 shadow-sm border border-slate-200" key={edu.id || index}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-semibold text-slate-900 leading-tight">{edu.degree}</h4>
                      <p className="text-xs text-blue-600 leading-tight">{edu.institution}</p>
                    </div>
                    <div className="text-right" style={{ flexShrink: 0 }}>
                      <span className="text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                        {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                      </span>
                      {edu.gpa && <p className="text-xs text-slate-500 mt-0.5">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills with modern tags */}
        {skills.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-2"></div>
              <h3 className="text-xs font-semibold text-slate-800">Skills</h3>
            </div>

            <div className="flex flex-wrap gap-1">
              {skills.map((skill, index) => (
                <span
                  className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-slate-800 text-xs rounded border border-blue-200 leading-tight"
                  key={index}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
