import { useResumeStore } from "@/hooks/use-resume-store";
import { formatDateRange } from "@/lib/utils";
import { TemplateComponent } from "./index";

export const CreativeTemplate: TemplateComponent = () => {
  const { content } = useResumeStore();
  const { personalInfo, summary, experience, education, skills } = content;

  return (
    <div className="p-3 h-full w-full flex text-slate-900 bg-gradient-to-br from-teal-50 via-white to-emerald-50 overflow-hidden text-xs">
      {/* Left sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-teal-600 to-emerald-600 text-white p-3 rounded-l-lg shadow-lg overflow-y-auto">
        {/* Profile section */}
        <div className="mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
            <span className="text-sm font-bold">
              {personalInfo.fullName ? personalInfo.fullName.split(' ').map(n => n[0]).join('') : 'YN'}
            </span>
          </div>
          <h1 className="text-sm font-bold text-center mb-1 leading-tight">
            {personalInfo.fullName || "Your Name"}
          </h1>
          <h2 className="text-xs font-light text-center opacity-90 leading-tight">
            {personalInfo.jobTitle || "Your Job Title"}
          </h2>
        </div>

        {/* Contact info */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider">Contact</h3>
          <div className="flex flex-col gap-1.5 text-xs">
            {personalInfo.email && (
              <div className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mt-1 mr-2 opacity-75" style={{ minWidth: '6px', minHeight: '6px' }}></span>
                <span className="text-xs break-all leading-tight">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mt-1 mr-2 opacity-75" style={{ minWidth: '6px', minHeight: '6px' }}></span>
                <span className="text-xs leading-tight">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mt-1 mr-2 opacity-75" style={{ minWidth: '6px', minHeight: '6px' }}></span>
                <span className="text-xs break-all leading-tight">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.profileUrl && (
              <div className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mt-1 mr-2 opacity-75" style={{ minWidth: '6px', minHeight: '6px' }}></span>
                <span className="text-xs break-all leading-tight">
                  {personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skills in sidebar */}
        {skills.length > 0 && (
          <div className="mb-3">
            <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider">Skills</h3>
            <div className="flex flex-col gap-1">
              {skills.slice(0, 8).map((skill, index) => (
                <div key={index} className="bg-white bg-opacity-20 rounded px-2 py-1" style={{ marginBottom: '2px' }}>
                  <span className="text-xs font-medium leading-tight block">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar */}
        {education.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider">Education</h3>
            <div className="flex flex-col gap-2">
              {education.map((edu, index) => (
                <div key={edu.id || index}>
                  <h4 className="text-xs font-semibold leading-tight">{edu.degree}</h4>
                  <p className="text-xs opacity-90 leading-tight">{edu.institution}</p>
                  <p className="text-xs opacity-75 leading-tight">
                    {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                  </p>
                  {edu.gpa && (
                    <p className="text-xs opacity-75">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right content area */}
      <div className="w-2/3 p-3 bg-white rounded-r-lg shadow-lg overflow-y-auto">
        {/* Summary */}
        {summary && (
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <div className="w-4 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mr-2"></div>
              <h3 className="text-xs font-bold text-slate-800">About Me</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mr-2"></div>
              <h3 className="text-xs font-bold text-slate-800">Experience</h3>
            </div>

            <div className="flex flex-col gap-2">
              {experience.map((exp, index) => (
                <div className="relative pl-3" key={exp.id || index}>
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 w-2 h-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></div>
                  {index < experience.length - 1 && (
                    <div className="absolute left-0.5 top-3 w-0.5 h-8 bg-gradient-to-b from-teal-200 to-emerald-200"></div>
                  )}

                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded p-2">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-xs font-semibold text-slate-900 leading-tight">{exp.position}</h4>
                        <p className="text-xs font-medium text-teal-700 leading-tight">{exp.company}</p>
                        {exp.location && <p className="text-xs text-slate-500 leading-tight">{exp.location}</p>}
                      </div>
                      <span className="text-xs text-slate-600 bg-white px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap" style={{ flexShrink: 0 }}>
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <ul className="text-xs text-slate-700 list-disc list-outside ml-3 mt-1">
                      {exp.description.slice(0, 3).map((desc, descIndex) => (
                        <li className="leading-tight mb-0.5" key={descIndex}>
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
