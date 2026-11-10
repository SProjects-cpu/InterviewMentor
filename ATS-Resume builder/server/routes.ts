import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Using Groq Compound model instead of Gemini
import { enhanceSummary, simplifySummary, calculateATSScore, suggestSkills, analyzeJobDescription } from "./lib/groq";
import { generatePDF } from "./lib/pdfGenerator";
import { z } from "zod";
import { resumeContentSchema, type ResumeContent } from "./schema-sqlite";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Get all resumes (currently without authentication)
  app.get("/api/resumes", async (req: Request, res: Response) => {
    try {
      // For demo purposes, we'll use userId=1
      const userId = 1;
      const resumes = await storage.getResumesByUserId(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error getting resumes:", error);
      res.status(500).json({ message: "Failed to get resumes" });
    }
  });

  // Get a resume by ID
  app.get("/api/resumes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }

      const resume = await storage.getResumeById(id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      res.json(resume);
    } catch (error) {
      console.error("Error getting resume:", error);
      res.status(500).json({ message: "Failed to get resume" });
    }
  });

  // Create a new resume
  app.post("/api/resumes", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const { userId, title, template, content } = req.body;

      if (!userId || !title || !content) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Clean content before validation - remove empty entries
      const cleanedContent = {
        ...content,
        certifications: content.certifications?.filter(cert => cert.name?.trim() && cert.issuer?.trim()) || [],
        projects: content.projects?.filter(proj => proj.name?.trim() && proj.description?.trim()) || [],
        languages: content.languages?.filter(lang => lang.name?.trim()) || [],
        volunteer: content.volunteer?.filter(vol => vol.organization?.trim() && vol.role?.trim()) || [],
        experience: content.experience?.map(exp => ({
          ...exp,
          description: exp.description?.filter(desc => desc?.trim()) || []
        })) || []
      };

      // Validate cleaned resume content
      try {
        resumeContentSchema.parse(cleanedContent);
      } catch (error) {
        console.error("Resume content validation error:", JSON.stringify(error, null, 2));
        console.error("Content being validated:", JSON.stringify(cleanedContent, null, 2));
        return res.status(400).json({ message: "Invalid resume content", errors: error });
      }

      // Calculate ATS score (optional if API key not configured)
      let atsScore = null;
      try {
        const { score } = await calculateATSScore(cleanedContent);
        atsScore = score;
      } catch (error) {
        console.warn("ATS score calculation failed:", error.message);
        // Continue without ATS score
      }

      const newResume = await storage.createResume({
        userId,
        title,
        template: template || "stockholm",
        content: cleanedContent,
        atsScore
      });

      res.status(201).json(newResume);
    } catch (error) {
      console.error("Error creating resume:", error);
      res.status(500).json({ message: "Failed to create resume" });
    }
  });

  // Update a resume
  app.put("/api/resumes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }

      const { title, template, content } = req.body;
      
      // Clean and validate resume content if provided
      let cleanedContent = content;
      if (content) {
        // Clean content before validation - remove empty entries
        cleanedContent = {
          ...content,
          certifications: content.certifications?.filter(cert => cert.name?.trim() && cert.issuer?.trim()) || [],
          projects: content.projects?.filter(proj => proj.name?.trim() && proj.description?.trim()) || [],
          languages: content.languages?.filter(lang => lang.name?.trim()) || [],
          volunteer: content.volunteer?.filter(vol => vol.organization?.trim() && vol.role?.trim()) || [],
          experience: content.experience?.map(exp => ({
            ...exp,
            description: exp.description?.filter(desc => desc?.trim()) || []
          })) || []
        };

        try {
          resumeContentSchema.parse(cleanedContent);
        } catch (error) {
          return res.status(400).json({ message: "Invalid resume content", errors: error });
        }
      }

      // Check if resume exists
      const existingResume = await storage.getResumeById(id);
      if (!existingResume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      // Update ATS score if content changed
      let atsScore = existingResume.atsScore;
      if (cleanedContent) {
        try {
          const { score } = await calculateATSScore(cleanedContent);
          atsScore = score;
        } catch (error) {
          console.warn("ATS score calculation failed:", error.message);
          // Continue without updating ATS score
        }
      }

      const updatedResume = await storage.updateResume(id, {
        title,
        template,
        content: cleanedContent,
        atsScore
      });

      if (!updatedResume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      res.json(updatedResume);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  // Delete a resume
  app.delete("/api/resumes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }

      const success = await storage.deleteResume(id);
      if (!success) {
        return res.status(404).json({ message: "Resume not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // AI Enhancement routes
  app.post("/api/ai/enhance-summary", async (req: Request, res: Response) => {
    try {
      const { summary, jobTitle } = req.body;
      
      if (!summary) {
        return res.status(400).json({ message: "Summary is required" });
      }
      
      const enhancedSummary = await enhanceSummary(summary, jobTitle || "");
      res.json({ enhancedSummary });
    } catch (error) {
      console.error("Error enhancing summary:", error);
      res.status(500).json({ message: "Failed to enhance summary" });
    }
  });

  app.post("/api/ai/simplify-summary", async (req: Request, res: Response) => {
    try {
      const { summary } = req.body;
      
      if (!summary) {
        return res.status(400).json({ message: "Summary is required" });
      }
      
      const simplifiedSummary = await simplifySummary(summary);
      res.json({ simplifiedSummary });
    } catch (error) {
      console.error("Error simplifying summary:", error);
      res.status(500).json({ message: "Failed to simplify summary" });
    }
  });

  app.post("/api/ai/calculate-ats-score", async (req: Request, res: Response) => {
    try {
      const { resumeContent, jobDescription } = req.body;

      if (!resumeContent) {
        return res.status(400).json({ message: "Resume content is required" });
      }

      // Clean content before ATS calculation - remove empty entries
      const cleanedContent = {
        ...resumeContent,
        certifications: resumeContent.certifications?.filter(cert => cert.name?.trim() && cert.issuer?.trim()) || [],
        projects: resumeContent.projects?.filter(proj => proj.name?.trim() && proj.description?.trim()) || [],
        languages: resumeContent.languages?.filter(lang => lang.name?.trim()) || [],
        volunteer: resumeContent.volunteer?.filter(vol => vol.organization?.trim() && vol.role?.trim()) || [],
        experience: resumeContent.experience?.map(exp => ({
          ...exp,
          description: exp.description?.filter(desc => desc?.trim()) || []
        })) || []
      };

      const result = await calculateATSScore(cleanedContent, jobDescription);
      res.json(result);
    } catch (error) {
      console.error("Error calculating ATS score:", error);
      res.status(500).json({ message: "Failed to calculate ATS score" });
    }
  });

  app.post("/api/ai/suggest-skills", async (req: Request, res: Response) => {
    try {
      const { jobTitle, experience } = req.body;

      if (!jobTitle) {
        return res.status(400).json({ message: "Job title is required" });
      }

      const skills = await suggestSkills(jobTitle, experience || "");
      res.json({ skills });
    } catch (error) {
      console.error("Error suggesting skills:", error);
      res.status(500).json({ message: "Failed to suggest skills" });
    }
  });

  app.post("/api/ai/analyze-job-description", async (req: Request, res: Response) => {
    try {
      const { jobDescription } = req.body;

      if (!jobDescription) {
        return res.status(400).json({ message: "Job description is required" });
      }

      const analysis = await analyzeJobDescription(jobDescription);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing job description:", error);
      res.status(500).json({ message: "Failed to analyze job description" });
    }
  });

  // Generate PDF
  app.post("/api/resumes/:id/pdf", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }

      const resume = await storage.getResumeById(id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      // Generate PDF
      try {
        // Clean content before validation - remove empty entries
        const cleanedContent = {
          ...resume.content,
          certifications: resume.content.certifications?.filter(cert => cert.name?.trim() && cert.issuer?.trim()) || [],
          projects: resume.content.projects?.filter(proj => proj.name?.trim() && proj.description?.trim()) || [],
          languages: resume.content.languages?.filter(lang => lang.name?.trim()) || [],
          volunteer: resume.content.volunteer?.filter(vol => vol.organization?.trim() && vol.role?.trim()) || [],
          experience: resume.content.experience?.map(exp => ({
            ...exp,
            description: exp.description?.filter(desc => desc?.trim()) || []
          })) || []
        };

        // Parse and validate the cleaned content with Zod before passing to PDF generator
        const resumeContent = resumeContentSchema.parse(cleanedContent);

        const pdf = await generatePDF(resumeContent, resume.template);
        
        // Set headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/\s+/g, '_')}.pdf"`);
        
        // Send the PDF
        res.send(pdf);
      } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Failed to generate PDF" });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // Get available templates
  app.get("/api/templates", (req: Request, res: Response) => {
    // Define available templates with new modern designs
    const templates = [
      {
        id: "stockholm",
        name: "Stockholm",
        category: "professional",
        isPremium: false,
        description: "Clean and professional design"
      },
      {
        id: "berlin",
        name: "Berlin",
        category: "professional",
        isPremium: false,
        description: "Traditional professional layout"
      },
      {
        id: "tokyo",
        name: "Tokyo",
        category: "creative",
        isPremium: false,
        description: "Creative centered design"
      },
      {
        id: "modern",
        name: "Modern",
        category: "modern",
        isPremium: false,
        description: "Contemporary gradient design with modern styling"
      },
      {
        id: "minimalist",
        name: "Minimalist",
        category: "modern",
        isPremium: false,
        description: "Clean minimal design with elegant typography"
      },
      {
        id: "creative",
        name: "Creative",
        category: "creative",
        isPremium: false,
        description: "Vibrant creative layout with sidebar design"
      }
    ];

    res.json(templates);
  });

  const httpServer = createServer(app);

  return httpServer;
}
