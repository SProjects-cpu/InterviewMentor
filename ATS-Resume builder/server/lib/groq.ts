/**
 * Groq AI Provider for Resume Builder
 * Uses Groq Compound model as primary AI provider
 */

import Groq from 'groq-sdk';
import type { ResumeContent } from '../../shared/schema';

// Initialize Groq client with API key
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = 'groq/compound';

const groq = new Groq({ apiKey: GROQ_API_KEY });

// Helper function to generate content using Groq
async function generateContent(prompt: string, maxTokens: number = 2048): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.7,
  });
  
  return completion.choices[0]?.message?.content || '';
}

// Enhance a resume summary
export async function enhanceSummary(summary: string, jobTitle: string): Promise<string> {
  const prompt = `
    Enhance the following professional summary for a ${jobTitle} role.
    Make it more impactful, concise, and focused on achievements and value proposition.
    The enhanced summary should:
    - Be 3-5 sentences long
    - Highlight key skills and expertise relevant to the job title
    - Include measurable achievements where applicable
    - Use strong action verbs
    - Avoid clichés and generic statements
    - Be written in first-person without using "I"
    - Use plain text only, no markdown formatting, no asterisks (*), no bold markers (**)
    - Write in professional business language with proper punctuation

    Original summary: "${summary}"

    Enhanced summary:`;

  try {
    const text = await generateContent(prompt);
    // Clean up any markdown formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_{2,}(.*?)_{2,}/g, '$1')
      .trim();
  } catch (error) {
    console.error("Error enhancing summary:", error);
    throw new Error("Failed to enhance summary. Please try again later.");
  }
}

// Simplify a resume summary
export async function simplifySummary(summary: string): Promise<string> {
  const prompt = `
    Simplify and shorten the following professional summary while maintaining the key points.
    The simplified summary should:
    - Be 2-3 sentences maximum
    - Use simple, clear language
    - Eliminate jargon and buzzwords
    - Focus only on the most important skills and experiences
    - Use active voice
    - Use plain text only, no markdown formatting

    Original summary: "${summary}"

    Simplified summary:`;

  try {
    const text = await generateContent(prompt);
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_{2,}(.*?)_{2,}/g, '$1')
      .trim();
  } catch (error) {
    console.error("Error simplifying summary:", error);
    throw new Error("Failed to simplify summary. Please try again later.");
  }
}


// Calculate the ATS score for a resume
export async function calculateATSScore(
  resumeContent: ResumeContent,
  jobTitle?: string,
  jobDescription?: string
): Promise<{ score: number; suggestions: string[]; keywordMatches: number; missingKeywords: string[] }> {
  const defaultJobDescription = `
    Seeking a ${resumeContent.personalInfo.jobTitle || jobTitle || "professional"} with
    experience in relevant industry. The ideal candidate possesses strong communication,
    teamwork, and problem-solving skills. Must be proficient with industry-standard tools
    and technologies. Bachelor's degree preferred.
  `;

  const prompt = `
    You are an expert ATS (Applicant Tracking System) analyzer.
    Analyze this resume for a ${jobTitle || resumeContent.personalInfo.jobTitle || "professional"} position.

    Job Description: ${jobDescription || defaultJobDescription}

    Resume Content:
    Name: ${resumeContent.personalInfo.fullName || "Not provided"}
    Job Title: ${resumeContent.personalInfo.jobTitle || "Not provided"}
    Email: ${resumeContent.personalInfo.email || "Not provided"}
    Location: ${resumeContent.personalInfo.location || "Not provided"}

    Summary: ${resumeContent.summary || "No summary provided"}

    Skills: ${resumeContent.skills.length > 0 ? resumeContent.skills.join(", ") : "No skills listed"}

    Experience:
    ${resumeContent.experience.length > 0 ? resumeContent.experience.map((exp, i) =>
      `${i + 1}. ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})
      ${exp.description.join("; ")}`
    ).join("\n") : "No experience provided"}

    Education:
    ${resumeContent.education.length > 0 ? resumeContent.education.map((edu, i) =>
      `${i + 1}. ${edu.degree} from ${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})`
    ).join("\n") : "No education provided"}

    Return ONLY a valid JSON object (no markdown, no explanation):
    {
      "score": number (0-100),
      "suggestions": ["suggestion1", "suggestion2", ...] (5-7 items),
      "keywordMatches": number,
      "missingKeywords": ["keyword1", "keyword2", ...] (3-5 items)
    }`;

  try {
    const text = await generateContent(prompt);
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : '{"score": 70, "suggestions": ["Add more relevant keywords"], "keywordMatches": 0, "missingKeywords": []}';
    const parsed = JSON.parse(jsonString);

    return {
      score: Math.min(100, Math.max(0, parsed.score)),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [String(parsed.suggestions)],
      keywordMatches: typeof parsed.keywordMatches === 'number' ? parsed.keywordMatches : 0,
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : []
    };
  } catch (error) {
    console.error("Error calculating ATS score:", error);
    // Return fallback response
    return {
      score: 70,
      suggestions: [
        "Include relevant keywords from the job description",
        "Quantify your achievements with specific metrics",
        "Use standard section headings for ATS compatibility",
        "Add more technical skills relevant to your field",
        "Include action verbs to describe accomplishments"
      ],
      keywordMatches: 0,
      missingKeywords: ["Leadership", "Communication", "Problem Solving"]
    };
  }
}

// Analyze job description
export async function analyzeJobDescription(jobDescription: string): Promise<{
  requiredSkills: string[];
  preferredSkills: string[];
  keyResponsibilities: string[];
  experienceLevel: string;
  educationRequirements: string[];
}> {
  const prompt = `
    Analyze this job description and extract key information:

    ${jobDescription}

    Return ONLY a valid JSON object (no markdown):
    {
      "requiredSkills": ["skill1", "skill2", ...] (5-10 items),
      "preferredSkills": ["skill1", "skill2", ...] (3-5 items),
      "keyResponsibilities": ["resp1", "resp2", ...] (3-5 items),
      "experienceLevel": "entry/mid/senior",
      "educationRequirements": ["req1", "req2", ...]
    }`;

  try {
    const text = await generateContent(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : '{}';
    const parsed = JSON.parse(jsonString);

    return {
      requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
      preferredSkills: Array.isArray(parsed.preferredSkills) ? parsed.preferredSkills : [],
      keyResponsibilities: Array.isArray(parsed.keyResponsibilities) ? parsed.keyResponsibilities : [],
      experienceLevel: typeof parsed.experienceLevel === 'string' ? parsed.experienceLevel : 'mid',
      educationRequirements: Array.isArray(parsed.educationRequirements) ? parsed.educationRequirements : []
    };
  } catch (error) {
    console.error("Error analyzing job description:", error);
    return {
      requiredSkills: ["Communication", "Problem Solving", "Teamwork"],
      preferredSkills: ["Leadership", "Project Management"],
      keyResponsibilities: ["Collaborate with team", "Deliver projects"],
      experienceLevel: "mid",
      educationRequirements: ["Bachelor's degree"]
    };
  }
}

// Suggest skills based on job title
export async function suggestSkills(jobTitle: string, experience: string): Promise<string[]> {
  const prompt = `
    Suggest 10 relevant skills for a ${jobTitle} role based on this experience:
    ${experience}
    
    Return ONLY a JSON array of skill names:
    ["Skill 1", "Skill 2", ...]`;

  try {
    const text = await generateContent(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : '[]';
    const parsed = JSON.parse(jsonString);
    
    if (Array.isArray(parsed)) {
      return parsed.filter(skill => typeof skill === 'string').slice(0, 10);
    }
    return [];
  } catch (error) {
    console.error("Error suggesting skills:", error);
    return ["Communication", "Problem Solving", "Teamwork", "Time Management", "Leadership"];
  }
}
