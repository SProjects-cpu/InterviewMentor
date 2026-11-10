import { useResumeStore } from "@/hooks/use-resume-store";
import { formatDateRange } from "@/lib/utils";
import { TemplateComponent } from "./index";

export const TokyoTemplate: TemplateComponent = () => {
  const { content } = useResumeStore();
  const { personalInfo, summary, experience, education, skills } = content;

  return (
    <div className="h-full w-full flex flex-col text-slate-900 bg-white overflow-hidden text-xs">
      {/* Header with sidebar - Tokyo inspired design */}
      <div className="flex flex-shrink-0">
        {/* Main content */}
        <div className="w-3/4 p-3">
          <h1 className="text-lg font-bold text-slate-900 leading-tight">{personalInfo.fullName || "Your Name"}</h1>
          <h2 className="text-sm font-medium text-red-600 mb-2 leading-tight">{personalInfo.jobTitle || "Your Job Title"}</h2>

          {/* Summary */}
          {summary && (
            <div className="mb-3">
              <h3 className="text-xs font-bold text-red-800 mb-1 flex items-center">
                <span className="w-4 h-0.5 bg-red-500 mr-1"></span>
                PROFESSIONAL SUMMARY
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {summary}
              </p>
            </div>
          )}
        </div>

        {/* Contact sidebar - Tokyo theme with subtle red accents */}
        <div className="w-1/4 bg-red-50 p-3 flex flex-col gap-1.5">
          {personalInfo.email && (
            <div className="flex items-start text-xs text-slate-700">
              <span className="mr-1.5 text-red-600" style={{ minWidth: '12px' }}>✉</span>
              <span className="text-xs break-all leading-tight">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-start text-xs text-slate-700">
              <span className="mr-1.5 text-red-600" style={{ minWidth: '12px' }}>☎</span>
              <span className="text-xs leading-tight">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-start text-xs text-slate-700">
              <span className="mr-1.5 text-red-600" style={{ minWidth: '12px' }}>📍</span>
              <span className="text-xs break-all leading-tight">{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.profileUrl && (
            <div className="flex items-start text-xs text-slate-700">
              <span className="mr-1.5 text-red-600" style={{ minWidth: '12px' }}>🔗</span>
              <span className="text-xs break-all leading-tight">{personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 px-3 pb-3 overflow-y-auto flex flex-col gap-3">
        {/* Experience - Tokyo theme with red accents */}
        {experience.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-red-800 mb-2 flex items-center">
              <span className="w-4 h-0.5 bg-red-500 mr-1"></span>
              WORK EXPERIENCE
            </h3>

            <div className="flex flex-col gap-2">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="pl-2 border-l-2 border-red-100">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-semibold text-slate-900 leading-tight flex-1 min-w-0 pr-2">{exp.position}</h4>
                    <span className="text-xs text-red-600 font-medium whitespace-nowrap" style={{ flexShrink: 0 }}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1 leading-tight">
                    {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                  </p>
                  <ul className="text-xs text-slate-700 list-disc list-outside ml-3">
                    {exp.description.slice(0, 3).map((desc, descIndex) => (
                      <li key={descIndex} className="leading-tight mb-0.5">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two column layout for education and skills */}
        <div className="flex gap-3">
          {/* Education - Tokyo theme */}
          {education.length > 0 && (
            <div className="w-1/2">
              <h3 className="text-xs font-bold text-red-800 mb-2 flex items-center">
                <span className="w-4 h-0.5 bg-red-500 mr-1"></span>
                EDUCATION
              </h3>

              <div className="flex flex-col gap-1">
                {education.map((edu, index) => (
                  <div key={edu.id || index}>
                    <h4 className="text-xs font-semibold text-slate-900 leading-tight">{edu.degree}</h4>
                    <p className="text-xs text-red-600 font-medium leading-tight">{edu.institution}</p>
                    <p className="text-xs text-slate-600 leading-tight">
                      {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                      {edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills - Tokyo theme with red accents */}
          {skills.length > 0 && (
            <div className="w-1/2">
              <h3 className="text-xs font-bold text-red-800 mb-2 flex items-center">
                <span className="w-4 h-0.5 bg-red-500 mr-1"></span>
                SKILLS
              </h3>

              <div className="flex flex-wrap gap-1">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block px-1.5 py-0.5 bg-red-50 text-red-800 text-xs rounded border border-red-100 leading-tight"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
