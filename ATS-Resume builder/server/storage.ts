import { resumes, type Resume, type InsertResume, type ResumeContent, users, type User, type InsertUser } from "./schema-sqlite";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Helper function to handle JSON content for different databases
function serializeContent(content: ResumeContent): any {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const forceLocalSQLite = true; // Force SQLite for local development
  const hasPostgresUrl = !!process.env.DATABASE_URL && !forceLocalSQLite;

  if (isDevelopment || forceLocalSQLite) {
    // SQLite: store as JSON string
    return JSON.stringify(content);
  } else {
    // PostgreSQL: store as JSONB
    return content;
  }
}

function deserializeContent(content: any): ResumeContent {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const forceLocalSQLite = true; // Force SQLite for local development
  const hasPostgresUrl = !!process.env.DATABASE_URL && !forceLocalSQLite;

  let parsedContent;
  if (isDevelopment || forceLocalSQLite) {
    // SQLite: parse JSON string
    parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
  } else {
    // PostgreSQL: already an object
    parsedContent = content;
  }

  // Ensure backward compatibility by adding missing fields with default values
  return {
    ...parsedContent,
    certifications: parsedContent.certifications || [],
    projects: parsedContent.projects || [],
    languages: parsedContent.languages || [],
    volunteer: parsedContent.volunteer || []
  };
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Resume methods
  getResumeById(id: number): Promise<Resume | undefined>;
  getResumesByUserId(userId: number): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, resume: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getResumeById(id: number): Promise<Resume | undefined> {
    const result = await db.select().from(resumes).where(eq(resumes.id, id));
    if (result.length > 0) {
      const resume = result[0];
      return {
        ...resume,
        content: deserializeContent(resume.content)
      };
    }
    return undefined;
  }

  async getResumesByUserId(userId: number): Promise<Resume[]> {
    const results = await db.select().from(resumes).where(eq(resumes.userId, userId));
    return results.map(resume => ({
      ...resume,
      content: deserializeContent(resume.content)
    }));
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const result = await db.insert(resumes).values({
      ...insertResume,
      content: serializeContent(insertResume.content),
      // Set default values for any optional fields
      atsScore: insertResume.atsScore ?? null,
      template: insertResume.template ?? "stockholm"
    }).returning();
    const resume = result[0];
    return {
      ...resume,
      content: deserializeContent(resume.content)
    };
  }

  async updateResume(id: number, updates: Partial<InsertResume>): Promise<Resume | undefined> {
    // Make sure to update the updatedAt timestamp
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const forceLocalSQLite = true; // Force SQLite for local development
    const hasPostgresUrl = !!process.env.DATABASE_URL && !forceLocalSQLite;
    const now = (isDevelopment || forceLocalSQLite) ? new Date().toISOString() : new Date();

    const updateData: any = { ...updates };

    // Serialize content if it exists in updates
    if (updates.content) {
      updateData.content = serializeContent(updates.content);
    }

    const result = await db.update(resumes)
      .set({
        ...updateData,
        updatedAt: now
      })
      .where(eq(resumes.id, id))
      .returning();

    if (result.length > 0) {
      const resume = result[0];
      return {
        ...resume,
        content: deserializeContent(resume.content)
      };
    }
    return undefined;
  }

  async deleteResume(id: number): Promise<boolean> {
    const result = await db.delete(resumes).where(eq(resumes.id, id)).returning();
    return result.length > 0;
  }

  // Initialize the database with sample data if needed
  async initializeWithSampleData(): Promise<void> {
    // Check if there are any users already in the database
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      // Create a demo user first
      const demoUser = await this.createUser({
        username: 'demo',
        password: 'password'
      });
      
      // Create a demo resume
      const demoResumeContent: ResumeContent = {
        personalInfo: {
          fullName: "Alex Johnson",
          jobTitle: "Senior Software Engineer",
          email: "alex.johnson@example.com",
          phone: "+1 (555) 987-6543",
          location: "Seattle, WA",
          profileUrl: "https://linkedin.com/in/alexjohnson"
        },
        summary: "Senior Software Engineer with 5+ years of experience in developing scalable applications using JavaScript, React, and Node.js. Proven track record of reducing application load time by 40% and implementing CI/CD pipelines that decreased deployment time by 60%. Passionate about clean code and mentoring junior developers.",
        experience: [
          {
            id: uuidv4(),
            company: "TechCorp",
            position: "Senior Software Engineer",
            location: "Seattle, WA",
            startDate: "2020-01",
            endDate: "",
            current: true,
            description: [
              "Led a team of 5 engineers to deliver a microservices-based application serving 50,000+ daily users",
              "Reduced application load time by 40% through code optimization and implementation of Redis caching",
              "Implemented CI/CD pipelines with GitHub Actions that decreased deployment time by 60%"
            ]
          },
          {
            id: uuidv4(),
            company: "InnoSoft",
            position: "Software Developer",
            location: "Portland, OR",
            startDate: "2018-03",
            endDate: "2019-12",
            current: false,
            description: [
              "Developed and maintained frontend applications using React, Redux, and TypeScript",
              "Collaborated with UX designers to implement responsive designs that improved user engagement by 25%"
            ]
          }
        ],
        education: [
          {
            id: uuidv4(),
            institution: "University of Washington",
            degree: "Bachelor of Science in Computer Science",
            startDate: "2014",
            endDate: "2018",
            gpa: "3.8/4.0",
            description: []
          }
        ],
        skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "CI/CD", "Git", "Docker"],
        certifications: [],
        projects: [],
        languages: [],
        volunteer: []
      };

      await this.createResume({
        userId: demoUser.id,
        title: "Software Engineer Resume",
        template: "stockholm",
        content: demoResumeContent,
        atsScore: 82
      });
    }
  }
}

export const storage = new DatabaseStorage();