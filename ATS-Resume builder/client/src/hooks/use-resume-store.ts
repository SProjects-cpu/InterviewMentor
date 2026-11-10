import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ResumeContent, PersonalInfo, ExperienceItem, EducationItem, CertificationItem, ProjectItem, LanguageItem, VolunteerItem, Template } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export type ResumeState = {
  resumeId: number | null;
  title: string;
  template: string;
  content: ResumeContent;
  atsScore: number | null;
  atsSuggestions: string[];
  atsKeywordMatches: number;
  atsMissingKeywords: string[];
  availableTemplates: Template[];
  isModified: boolean;
  
  // Loading states
  isSaving: boolean;
  isLoading: boolean;
  isCalculatingAtsScore: boolean;
  autoSaveEnabled: boolean;
  
  // Resume actions
  loadResume: (resumeId: number) => Promise<void>;
  createResume: (title: string, template: string, content: ResumeContent) => Promise<number>;
  saveResume: () => Promise<void>;
  setTemplate: (template: string) => void;
  setTitle: (title: string) => void;
  
  // Personal info actions
  setPersonalInfo: (personalInfo: PersonalInfo) => void;
  updatePersonalInfoField: (field: keyof PersonalInfo, value: string) => void;
  
  // Summary actions
  setSummary: (summary: string) => void;
  enhanceSummary: () => Promise<void>;
  simplifySummary: () => Promise<void>;
  
  // Experience actions
  addExperience: () => void;
  updateExperience: (index: number, experience: ExperienceItem) => void;
  deleteExperience: (index: number) => void;
  moveExperience: (fromIndex: number, toIndex: number) => void;
  addExperienceDescription: (index: number, description: string) => void;
  
  // Education actions
  addEducation: () => void;
  updateEducation: (index: number, education: EducationItem) => void;
  deleteEducation: (index: number) => void;
  moveEducation: (fromIndex: number, toIndex: number) => void;
  
  // Skills actions
  addSkill: (skill: string) => void;
  deleteSkill: (index: number) => void;
  suggestSkills: () => Promise<void>;

  // Certifications actions
  addCertification: () => void;
  updateCertification: (index: number, certification: CertificationItem) => void;
  deleteCertification: (index: number) => void;

  // Projects actions
  addProject: () => void;
  updateProject: (index: number, project: ProjectItem) => void;
  deleteProject: (index: number) => void;

  // Languages actions
  addLanguage: () => void;
  updateLanguage: (index: number, language: LanguageItem) => void;
  deleteLanguage: (index: number) => void;

  // Volunteer actions
  addVolunteer: () => void;
  updateVolunteer: (index: number, volunteer: VolunteerItem) => void;
  deleteVolunteer: (index: number) => void;

  // ATS actions
  calculateATSScore: () => Promise<void>;

  // Templates actions
  loadTemplates: () => Promise<void>;

  // Auto-save actions
  toggleAutoSave: () => void;
};

const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  fullName: 'John Smith',
  jobTitle: 'Marketing Manager',
  email: 'john.smith@email.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  profileUrl: 'https://linkedin.com/in/johnsmith',
};

const DEFAULT_RESUME_CONTENT: ResumeContent = {
  personalInfo: DEFAULT_PERSONAL_INFO,
  summary: 'Results-driven marketing professional with 5+ years of experience in digital marketing, brand management, and campaign optimization. Proven track record of increasing brand awareness and driving revenue growth through innovative marketing strategies.',
  experience: [
    {
      id: 'exp-1',
      company: 'TechCorp Solutions',
      position: 'Senior Marketing Specialist',
      location: 'New York, NY',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: [
        'Led digital marketing campaigns that increased brand awareness by 40%',
        'Managed social media strategy across multiple platforms with 50K+ followers',
        'Collaborated with cross-functional teams to launch 3 successful product campaigns'
      ],
    },
    {
      id: 'exp-2',
      company: 'Digital Marketing Agency',
      position: 'Marketing Coordinator',
      location: 'New York, NY',
      startDate: '2020-06',
      endDate: '2021-12',
      current: false,
      description: [
        'Developed and executed email marketing campaigns with 25% open rate',
        'Analyzed campaign performance data to optimize marketing strategies',
        'Supported client relationship management and project coordination'
      ],
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'New York University',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Marketing',
      startDate: '2016-09',
      endDate: '2020-05',
      gpa: '3.7',
      description: ['Magna Cum Laude', 'Marketing Club President'],
    }
  ],
  skills: ['Digital Marketing', 'Social Media Management', 'Google Analytics', 'Content Creation', 'Email Marketing', 'SEO/SEM', 'Adobe Creative Suite', 'Project Management'],
  certifications: [],
  projects: [],
  languages: [],
  volunteer: [],
};

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumeId: null,
  title: 'Untitled Resume',
  template: 'stockholm',
  content: DEFAULT_RESUME_CONTENT,
  atsScore: null,
  atsSuggestions: [],
  atsKeywordMatches: 0,
  atsMissingKeywords: [],
  availableTemplates: [],
  isModified: false,
  isSaving: false,
  isLoading: false,
  isCalculatingAtsScore: false,
  autoSaveEnabled: true,
  
  loadResume: async (resumeId: number) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/resumes/${resumeId}`);
      if (!response.ok) {
        throw new Error('Failed to load resume');
      }
      const resume = await response.json();
      set({
        resumeId: resume.id,
        title: resume.title,
        template: resume.template,
        content: resume.content,
        atsScore: resume.atsScore || null,
        isModified: false,
      });
    } catch (error) {
      console.error('Error loading resume:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  createResume: async (title: string, template: string, content: ResumeContent) => {
    set({ isSaving: true });
    try {
      // Clean content before creating - remove empty entries
      const cleanedContent = {
        ...content,
        certifications: content.certifications.filter(cert => cert.name.trim() && cert.issuer.trim()),
        projects: content.projects.filter(proj => proj.name.trim() && proj.description.trim()),
        languages: content.languages.filter(lang => lang.name.trim()),
        volunteer: content.volunteer.filter(vol => vol.organization.trim() && vol.role.trim()),
        experience: content.experience.map(exp => ({
          ...exp,
          description: exp.description.filter(desc => desc.trim())
        }))
      };

      const response = await apiRequest('POST', '/api/resumes', {
        userId: 1, // Using fixed userId for demo
        title,
        template,
        content: cleanedContent,
      });
      const newResume = await response.json();
      set({
        resumeId: newResume.id,
        title: newResume.title,
        template: newResume.template,
        content: newResume.content,
        atsScore: newResume.atsScore || null,
        isModified: false,
      });
      return newResume.id;
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },
  
  saveResume: async () => {
    const { resumeId, title, template, content, isModified } = get();

    if (!resumeId || !isModified) {
      console.log('Save skipped: resumeId =', resumeId, 'isModified =', isModified);
      return;
    }

    set({ isSaving: true });
    try {
      console.log('Saving resume:', resumeId);

      // Clean content before saving - remove empty entries
      const cleanedContent = {
        ...content,
        certifications: content.certifications.filter(cert => cert.name.trim() && cert.issuer.trim()),
        projects: content.projects.filter(proj => proj.name.trim() && proj.description.trim()),
        languages: content.languages.filter(lang => lang.name.trim()),
        volunteer: content.volunteer.filter(vol => vol.organization.trim() && vol.role.trim()),
        experience: content.experience.map(exp => ({
          ...exp,
          description: exp.description.filter(desc => desc.trim())
        }))
      };

      const response = await apiRequest('PUT', `/api/resumes/${resumeId}`, {
        title,
        template,
        content: cleanedContent,
      });

      if (!response.ok) {
        throw new Error(`Save failed: ${response.status} ${response.statusText}`);
      }

      const updatedResume = await response.json();
      set({
        title: updatedResume.title,
        template: updatedResume.template,
        content: updatedResume.content,
        atsScore: updatedResume.atsScore || null,
        isModified: false,
      });
      console.log('Resume saved successfully');
    } catch (error) {
      console.error('Error saving resume:', error);
      // Keep isModified as true if save failed
      set({ isModified: true });
    } finally {
      set({ isSaving: false });
    }
  },
  
  setTemplate: (template: string) => {
    set({ template, isModified: true });
  },
  
  setTitle: (title: string) => {
    set({ title, isModified: true });
  },
  
  setPersonalInfo: (personalInfo: PersonalInfo) => {
    set(state => ({
      content: {
        ...state.content,
        personalInfo,
      },
      isModified: true,
    }));
  },
  
  updatePersonalInfoField: (field: keyof PersonalInfo, value: string) => {
    set(state => ({
      content: {
        ...state.content,
        personalInfo: {
          ...state.content.personalInfo,
          [field]: value,
        },
      },
      isModified: true,
    }));
  },
  
  setSummary: (summary: string) => {
    set(state => ({
      content: {
        ...state.content,
        summary,
      },
      isModified: true,
    }));
  },
  
  enhanceSummary: async () => {
    const { content } = get();
    if (!content.summary) return;
    
    try {
      const response = await apiRequest('POST', '/api/ai/enhance-summary', {
        summary: content.summary,
        jobTitle: content.personalInfo.jobTitle,
      });
      const data = await response.json();
      
      if (data.enhancedSummary) {
        set(state => ({
          content: {
            ...state.content,
            summary: data.enhancedSummary,
          },
          isModified: true,
        }));
      }
    } catch (error) {
      console.error('Error enhancing summary:', error);
    }
  },
  
  simplifySummary: async () => {
    const { content } = get();
    if (!content.summary) return;
    
    try {
      const response = await apiRequest('POST', '/api/ai/simplify-summary', {
        summary: content.summary,
      });
      const data = await response.json();
      
      if (data.simplifiedSummary) {
        set(state => ({
          content: {
            ...state.content,
            summary: data.simplifiedSummary,
          },
          isModified: true,
        }));
      }
    } catch (error) {
      console.error('Error simplifying summary:', error);
    }
  },
  
  addExperience: () => {
    const newExperience: ExperienceItem = {
      id: uuidv4(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
    };
    
    set(state => ({
      content: {
        ...state.content,
        experience: [newExperience, ...state.content.experience],
      },
      isModified: true,
    }));
  },
  
  updateExperience: (index: number, experience: ExperienceItem) => {
    set(state => {
      const updatedExperience = [...state.content.experience];
      updatedExperience[index] = experience;
      
      return {
        content: {
          ...state.content,
          experience: updatedExperience,
        },
        isModified: true,
      };
    });
  },
  
  deleteExperience: (index: number) => {
    set(state => {
      const updatedExperience = [...state.content.experience];
      updatedExperience.splice(index, 1);
      
      return {
        content: {
          ...state.content,
          experience: updatedExperience,
        },
        isModified: true,
      };
    });
  },
  
  moveExperience: (fromIndex: number, toIndex: number) => {
    set(state => {
      const updatedExperience = [...state.content.experience];
      const [movedItem] = updatedExperience.splice(fromIndex, 1);
      updatedExperience.splice(toIndex, 0, movedItem);
      
      return {
        content: {
          ...state.content,
          experience: updatedExperience,
        },
        isModified: true,
      };
    });
  },
  
  addExperienceDescription: (index: number, description: string) => {
    set(state => {
      const updatedExperience = [...state.content.experience];
      updatedExperience[index] = {
        ...updatedExperience[index],
        description: [...updatedExperience[index].description, description],
      };
      
      return {
        content: {
          ...state.content,
          experience: updatedExperience,
        },
        isModified: true,
      };
    });
  },
  
  addEducation: () => {
    const newEducation: EducationItem = {
      id: uuidv4(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: [],
    };
    
    set(state => ({
      content: {
        ...state.content,
        education: [newEducation, ...state.content.education],
      },
      isModified: true,
    }));
  },
  
  updateEducation: (index: number, education: EducationItem) => {
    set(state => {
      const updatedEducation = [...state.content.education];
      updatedEducation[index] = education;
      
      return {
        content: {
          ...state.content,
          education: updatedEducation,
        },
        isModified: true,
      };
    });
  },
  
  deleteEducation: (index: number) => {
    set(state => {
      const updatedEducation = [...state.content.education];
      updatedEducation.splice(index, 1);
      
      return {
        content: {
          ...state.content,
          education: updatedEducation,
        },
        isModified: true,
      };
    });
  },
  
  moveEducation: (fromIndex: number, toIndex: number) => {
    set(state => {
      const updatedEducation = [...state.content.education];
      const [movedItem] = updatedEducation.splice(fromIndex, 1);
      updatedEducation.splice(toIndex, 0, movedItem);
      
      return {
        content: {
          ...state.content,
          education: updatedEducation,
        },
        isModified: true,
      };
    });
  },
  
  addSkill: (skill: string) => {
    if (!skill.trim()) return;
    
    set(state => {
      // Check if the skill already exists (case insensitive)
      if (state.content.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        return state;
      }
      
      return {
        content: {
          ...state.content,
          skills: [...state.content.skills, skill.trim()],
        },
        isModified: true,
      };
    });
  },
  
  deleteSkill: (index: number) => {
    set(state => {
      const updatedSkills = [...state.content.skills];
      updatedSkills.splice(index, 1);
      
      return {
        content: {
          ...state.content,
          skills: updatedSkills,
        },
        isModified: true,
      };
    });
  },
  
  suggestSkills: async () => {
    const { content } = get();
    const { jobTitle } = content.personalInfo;
    
    if (!jobTitle) return;
    
    try {
      // Gather experience descriptions for context
      const experienceContext = content.experience
        .map(exp => 
          `${exp.position} at ${exp.company}: ${exp.description.join(' ')}`)
        .join('\n');
      
      const response = await apiRequest('POST', '/api/ai/suggest-skills', {
        jobTitle,
        experience: experienceContext,
      });
      
      const data = await response.json();
      
      if (data.skills && data.skills.length) {
        // Filter out skills that already exist in the resume
        const existingSkills = new Set(content.skills.map(s => s.toLowerCase()));
        const newSkills = data.skills.filter((skill: string) => 
          !existingSkills.has(skill.toLowerCase())
        );
        
        if (newSkills.length) {
          set(state => ({
            content: {
              ...state.content,
              skills: [...state.content.skills, ...newSkills],
            },
            isModified: true,
          }));
        }
      }
    } catch (error) {
      console.error('Error suggesting skills:', error);
    }
  },
  
  calculateATSScore: async () => {
    const { content } = get();
    
    set({ isCalculatingAtsScore: true });
    try {
      const response = await apiRequest('POST', '/api/ai/calculate-ats-score', {
        resumeContent: content,
      });
      
      const data = await response.json();
      
      if (data.score !== undefined) {
        set({
          atsScore: data.score,
          atsSuggestions: data.suggestions || [],
          atsKeywordMatches: data.keywordMatches || 0,
          atsMissingKeywords: data.missingKeywords || [],
        });
      }
    } catch (error) {
      console.error('Error calculating ATS score:', error);
    } finally {
      set({ isCalculatingAtsScore: false });
    }
  },
  
  loadTemplates: async () => {
    try {
      const response = await fetch('/api/templates');
      if (!response.ok) {
        throw new Error('Failed to load templates');
      }
      const templates = await response.json();
      set({ availableTemplates: templates });
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  },

  // Certifications actions
  addCertification: () => {
    const newCertification: CertificationItem = {
      id: uuidv4(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    };

    set(state => ({
      content: {
        ...state.content,
        certifications: [newCertification, ...state.content.certifications],
      },
      isModified: true,
    }));
  },

  updateCertification: (index: number, certification: CertificationItem) => {
    set(state => {
      const updatedCertifications = [...state.content.certifications];
      updatedCertifications[index] = certification;

      return {
        content: {
          ...state.content,
          certifications: updatedCertifications,
        },
        isModified: true,
      };
    });
  },

  deleteCertification: (index: number) => {
    set(state => {
      const updatedCertifications = [...state.content.certifications];
      updatedCertifications.splice(index, 1);

      return {
        content: {
          ...state.content,
          certifications: updatedCertifications,
        },
        isModified: true,
      };
    });
  },

  // Projects actions
  addProject: () => {
    const newProject: ProjectItem = {
      id: uuidv4(),
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      url: '',
      highlights: [],
    };

    set(state => ({
      content: {
        ...state.content,
        projects: [newProject, ...state.content.projects],
      },
      isModified: true,
    }));
  },

  updateProject: (index: number, project: ProjectItem) => {
    set(state => {
      const updatedProjects = [...state.content.projects];
      updatedProjects[index] = project;

      return {
        content: {
          ...state.content,
          projects: updatedProjects,
        },
        isModified: true,
      };
    });
  },

  deleteProject: (index: number) => {
    set(state => {
      const updatedProjects = [...state.content.projects];
      updatedProjects.splice(index, 1);

      return {
        content: {
          ...state.content,
          projects: updatedProjects,
        },
        isModified: true,
      };
    });
  },

  // Languages actions
  addLanguage: () => {
    const newLanguage: LanguageItem = {
      id: uuidv4(),
      language: '',
      proficiency: 'Intermediate',
    };

    set(state => ({
      content: {
        ...state.content,
        languages: [newLanguage, ...state.content.languages],
      },
      isModified: true,
    }));
  },

  updateLanguage: (index: number, language: LanguageItem) => {
    set(state => {
      const updatedLanguages = [...state.content.languages];
      updatedLanguages[index] = language;

      return {
        content: {
          ...state.content,
          languages: updatedLanguages,
        },
        isModified: true,
      };
    });
  },

  deleteLanguage: (index: number) => {
    set(state => {
      const updatedLanguages = [...state.content.languages];
      updatedLanguages.splice(index, 1);

      return {
        content: {
          ...state.content,
          languages: updatedLanguages,
        },
        isModified: true,
      };
    });
  },

  // Volunteer actions
  addVolunteer: () => {
    const newVolunteer: VolunteerItem = {
      id: uuidv4(),
      organization: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
      location: '',
    };

    set(state => ({
      content: {
        ...state.content,
        volunteer: [newVolunteer, ...state.content.volunteer],
      },
      isModified: true,
    }));
  },

  updateVolunteer: (index: number, volunteer: VolunteerItem) => {
    set(state => {
      const updatedVolunteer = [...state.content.volunteer];
      updatedVolunteer[index] = volunteer;

      return {
        content: {
          ...state.content,
          volunteer: updatedVolunteer,
        },
        isModified: true,
      };
    });
  },

  deleteVolunteer: (index: number) => {
    set(state => {
      const updatedVolunteer = [...state.content.volunteer];
      updatedVolunteer.splice(index, 1);

      return {
        content: {
          ...state.content,
          volunteer: updatedVolunteer,
        },
        isModified: true,
      };
    });
  },

  toggleAutoSave: () => {
    set(state => ({ autoSaveEnabled: !state.autoSaveEnabled }));
  },
}));

// Auto-save functionality
let autoSaveTimeout: NodeJS.Timeout | null = null;

const originalSet = useResumeStore.setState;
useResumeStore.setState = (partial, replace) => {
  const result = originalSet(partial, replace);

  // Trigger auto-save when content changes
  const state = useResumeStore.getState();
  if (state.autoSaveEnabled && state.isModified && state.resumeId && !state.isSaving) {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    console.log('Auto-save scheduled for resume:', state.resumeId);
    autoSaveTimeout = setTimeout(async () => {
      try {
        await state.saveResume();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity
  }

  return result;
};
