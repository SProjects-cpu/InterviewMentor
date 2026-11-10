/**
 * Resume API Service - DISABLED
 * Resume builder functionality has been removed
 */

// All resume API functions disabled - functionality removed
export const resumeAPI = {
  async getResumes(): Promise<any[]> {
    throw new Error('Resume builder functionality has been removed');
  },

  async getResume(id: string): Promise<any> {
    throw new Error('Resume builder functionality has been removed');
  },

  async createResume(resumeData: any): Promise<any> {
    throw new Error('Resume builder functionality has been removed');
  },

  async updateResume(id: string, resumeData: any): Promise<any> {
    throw new Error('Resume builder functionality has been removed');
  },

  async deleteResume(id: string): Promise<void> {
    throw new Error('Resume builder functionality has been removed');
  },

  async getTemplates(): Promise<any[]> {
    throw new Error('Resume builder functionality has been removed');
  },

  async calculateATSScore(id: string, jobDescription?: string): Promise<any> {
    throw new Error('Resume builder functionality has been removed');
  },

  async enhanceSummary(data: any): Promise<any> {
    throw new Error('Resume builder functionality has been removed');
  },

  async suggestSkills(data: any): Promise<any> {
    throw new Error('Resume builder functionality has been removed');
  }
};

// Disabled class for removed functionality
class ResumeAPIService {
  constructor() {
    throw new Error('Resume builder functionality has been removed');
  }
}

// Helper functions for removed functionality
export const formatResumeForAPI = (resume: any) => {
  throw new Error('Resume builder functionality has been removed');
};

export const downloadResumeAsPDF = (id: string, filename: string) => {
  throw new Error('Resume builder functionality has been removed');
};

