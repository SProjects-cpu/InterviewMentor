import { useResumeStore } from "@/hooks/use-resume-store";
import { formatDateRange } from "@/lib/utils";
import { TemplateComponent } from "./index";

export const StockholmTemplate: TemplateComponent = () => {
  const { content } = useResumeStore();
  const { personalInfo, summary, experience, education, skills, certifications, projects, languages, volunteer } = content;

  return (
    <div className="p-6 h-full w-full flex flex-col text-slate-900 overflow-hidden text-xs leading-tight">
      {/* Header */}
      <div className="border-b border-slate-200 pb-2 mb-3 flex-shrink-0">
        <h1 className="text-lg font-bold leading-tight">{personalInfo.fullName || "Your Name"}</h1>
        <h2 className="text-sm text-primary-700 font-medium leading-tight">{personalInfo.jobTitle || "Your Job Title"}</h2>

        <div className="flex flex-wrap items-center mt-1 text-xs text-slate-600 gap-x-3 gap-y-1">
          {personalInfo.email && (
            <div className="flex items-center">
              <span className="mr-1 text-slate-400">✉</span>
              <span className="truncate max-w-[120px]">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <span className="mr-1 text-slate-400">☎</span>
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <span className="mr-1 text-slate-400">📍</span>
              <span className="truncate max-w-[100px]">{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.profileUrl && (
            <div className="flex items-center">
              <span className="mr-1 text-slate-400">🔗</span>
              <span className="truncate max-w-[120px]">{personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {/* Summary */}
        {summary && (
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">Professional Summary</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">Work Experience</h3>

            <div className="flex flex-col gap-2">
              {experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-semibold text-slate-900 leading-tight flex-1 min-w-0 pr-2">{exp.position}</h4>
                    <span className="text-xs text-slate-600 whitespace-nowrap" style={{ flexShrink: 0 }}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-primary-700">{exp.company}</p>
                    <span className="text-xs text-slate-600">{exp.location}</span>
                  </div>
                  <ul className="mt-0.5 text-xs text-slate-700 list-disc list-outside ml-3">
                    {exp.description.slice(0, 3).map((desc, descIndex) => (
                      <li className="leading-tight mb-0.5" key={descIndex}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">Education</h3>

            <div className="flex flex-col gap-1">
              {education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-semibold text-slate-900 leading-tight flex-1 min-w-0 pr-2">{edu.degree}</h4>
                    <span className="text-xs text-slate-600 whitespace-nowrap" style={{ flexShrink: 0 }}>
                      {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-primary-700">{edu.institution}</p>
                    <span className="text-xs text-slate-600">{edu.gpa ? `GPA: ${edu.gpa}` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">Skills</h3>

            <div className="flex flex-wrap gap-1">
              {skills.map((skill, index) => (
                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-800 text-xs rounded leading-tight" key={index}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">Certifications</h3>

            <div className="flex flex-col gap-1">
              {certifications.map((cert, index) => (
                <div key={cert.id || index}>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-semibold text-slate-900 leading-tight flex-1 min-w-0 pr-2">{cert.name}</h4>
                    <span className="text-xs text-slate-600 whitespace-nowrap" style={{ flexShrink: 0 }}>{cert.date}</span>
                  </div>
                  <p className="text-xs text-primary-700">{cert.issuer}</p>
                  {cert.credentialId && (
                    <p className="text-xs text-slate-600">ID: {cert.credentialId}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">Projects</h3>

            <div className="flex flex-col gap-2">
              {projects.slice(0, 2).map((project, index) => (
                <div key={project.id || index}>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-semibold text-slate-900 leading-tight flex-1 min-w-0 pr-2">{project.name}</h4>
                    <span className="text-xs text-slate-600 whitespace-nowrap" style={{ flexShrink: 0 }}>
                      {formatDateRange(project.startDate, project.endDate, false)}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-xs text-slate-700 mt-0.5 leading-tight">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.slice(0, 4).map((tech, techIndex) => (
                        <span className="px-1 py-0.5 bg-primary-100 text-primary-800 text-xs rounded leading-tight" key={techIndex}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">Languages</h3>

            <div className="flex flex-wrap gap-1">
              {languages.map((lang, index) => (
                <div className="flex items-center" key={lang.id || index}>
                  <span className="text-xs text-slate-900 mr-1">{lang.language}</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-xs rounded leading-tight">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteer Experience */}
        {volunteer.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">Volunteer Experience</h3>

            <div className="flex flex-col gap-2">
              {volunteer.slice(0, 2).map((vol, index) => (
                <div key={vol.id || index}>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-semibold text-slate-900 leading-tight flex-1 min-w-0 pr-2">{vol.position}</h4>
                    <span className="text-xs text-slate-600 whitespace-nowrap" style={{ flexShrink: 0 }}>
                      {formatDateRange(vol.startDate, vol.endDate, vol.current)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-primary-700">{vol.organization}</p>
                    <span className="text-xs text-slate-600">{vol.location}</span>
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
