import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ResumeContent } from '@shared/schema';

// Initialize the Gemini API with the provided API key
const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Set up safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Helper function to create a model - upgraded to Gemini 2.0 Flash
const getModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    }
  });
};

// Enhance a resume summary
export async function enhanceSummary(summary: string, jobTitle: string): Promise<string> {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured");
  }
  
  try {
    const model = getModel();
    
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
    - Use minimal tokens for concise, impactful content

    Original summary: "${summary}"

    Enhanced summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up any markdown formatting that might slip through
    const cleanedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
      .replace(/_{2,}(.*?)_{2,}/g, '$1') // Remove underline markdown
      .trim();

    return cleanedText;
  } catch (error) {
    console.error("Error enhancing summary:", error);
    throw new Error("Failed to enhance summary. Please try again later.");
  }
}

// Simplify a resume summary
export async function simplifySummary(summary: string): Promise<string> {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured");
  }
  
  try {
    const model = getModel();
    
    const prompt = `
    Simplify and shorten the following professional summary while maintaining the key points.
    The simplified summary should:
    - Be 2-3 sentences maximum
    - Use simple, clear language
    - Eliminate jargon and buzzwords
    - Focus only on the most important skills and experiences
    - Use active voice
    - Use plain text only, no markdown formatting, no asterisks (*), no bold markers (**)
    - Write in professional business language with proper punctuation
    - Use minimal tokens for concise, standardized output

    Original summary: "${summary}"

    Simplified summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up any markdown formatting that might slip through
    const cleanedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
      .replace(/_{2,}(.*?)_{2,}/g, '$1') // Remove underline markdown
      .trim();

    return cleanedText;
  } catch (error) {
    console.error("Error simplifying summary:", error);
    throw new Error("Failed to simplify summary. Please try again later.");
  }
}

// Calculate the ATS score for a resume with enhanced analysis
export async function calculateATSScore(
  resumeContent: ResumeContent,
  jobTitle?: string,
  jobDescription?: string
): Promise<{ score: number; suggestions: string[]; keywordMatches: number; missingKeywords: string[] }> {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured");
  }

  try {
    const model = getModel();

    // Default job description if none is provided
    const defaultJobDescription = `
    Seeking a ${resumeContent.personalInfo.jobTitle || jobTitle || "professional"} with
    experience in relevant industry. The ideal candidate possesses strong communication,
    teamwork, and problem-solving skills. Must be proficient with industry-standard tools
    and technologies. Bachelor's degree preferred.
    `;

    const prompt = `
    You are an expert ATS (Applicant Tracking System) analyzer with deep knowledge of modern recruitment practices.
    Perform a comprehensive analysis of this resume for a ${jobTitle || resumeContent.personalInfo.jobTitle || "professional"} position.

    Job Description/Requirements:
    ${jobDescription || defaultJobDescription}

    Resume Content:
    Personal Information:
    - Name: ${resumeContent.personalInfo.fullName || "Not provided"}
    - Job Title: ${resumeContent.personalInfo.jobTitle || "Not provided"}
    - Email: ${resumeContent.personalInfo.email || "Not provided"}
    - Phone: ${resumeContent.personalInfo.phone || "Not provided"}
    - Location: ${resumeContent.personalInfo.location || "Not provided"}

    Professional Summary:
    ${resumeContent.summary || "No summary provided"}

    Skills:
    ${resumeContent.skills.length > 0 ? resumeContent.skills.join(", ") : "No skills listed"}

    Work Experience:
    ${resumeContent.experience.length > 0 ? resumeContent.experience.map((exp, index) =>
      `${index + 1}. ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})
      Location: ${exp.location || "Not specified"}
      Responsibilities: ${exp.description.join("; ")}`
    ).join("\n\n") : "No work experience provided"}

    Education:
    ${resumeContent.education.length > 0 ? resumeContent.education.map((edu, index) =>
      `${index + 1}. ${edu.degree} in ${edu.fieldOfStudy || "field"} from ${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})
      GPA: ${edu.gpa || "Not provided"}`
    ).join("\n") : "No education provided"}

    Perform detailed analysis on:
    1. Keyword optimization and density
    2. ATS-friendly formatting and structure
    3. Skills alignment with job requirements
    4. Quantifiable achievements and metrics
    5. Education and certification relevance
    6. Contact information completeness
    7. Professional summary effectiveness
    8. Experience relevance and progression
    9. Missing critical keywords
    10. Overall ATS compatibility

    Return a JSON object with:
    {
      "score": number (0-100),
      "suggestions": [string] (5-7 specific actionable improvements),
      "keywordMatches": number (count of matched keywords),
      "missingKeywords": [string] (3-5 important missing keywords)
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract the JSON part from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{"score": 70, "suggestions": ["No specific suggestions available"], "keywordMatches": 0, "missingKeywords": []}';
      const parsed = JSON.parse(jsonString);

      return {
        score: Math.min(100, Math.max(0, parsed.score)), // Ensure score is between 0-100
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [String(parsed.suggestions)],
        keywordMatches: typeof parsed.keywordMatches === 'number' ? parsed.keywordMatches : 0,
        missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : []
      };
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini response:", parseError);
      // Fallback to a default response if parsing fails
      return {
        score: 70,
        suggestions: [
          "Include relevant keywords from the job description",
          "Quantify your achievements with specific metrics and numbers",
          "Ensure your resume uses standard section headings",
          "Add more technical skills relevant to your field",
          "Include action verbs to describe your accomplishments"
        ],
        keywordMatches: 0,
        missingKeywords: ["Leadership", "Communication", "Problem Solving"]
      };
    }
  } catch (error) {
    console.error("Error calculating ATS score:", error);
    throw new Error("Failed to calculate ATS score. Please try again later.");
  }
}

// Analyze job description and extract key requirements
export async function analyzeJobDescription(jobDescription: string): Promise<{
  requiredSkills: string[];
  preferredSkills: string[];
  keyResponsibilities: string[];
  experienceLevel: string;
  educationRequirements: string[];
}> {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured");
  }

  try {
    const model = getModel();

    const prompt = `
    Analyze the following job description and extract key information for resume optimization:

    Job Description:
    ${jobDescription}

    Extract and categorize the following information:
    1. Required technical and soft skills
    2. Preferred/nice-to-have skills
    3. Key responsibilities and duties
    4. Experience level required (entry, mid, senior, etc.)
    5. Education requirements

    Return a JSON object with:
    {
      "requiredSkills": [string] (5-10 must-have skills),
      "preferredSkills": [string] (3-5 nice-to-have skills),
      "keyResponsibilities": [string] (3-5 main responsibilities),
      "experienceLevel": string (entry/mid/senior level),
      "educationRequirements": [string] (degree requirements)
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{"requiredSkills": [], "preferredSkills": [], "keyResponsibilities": [], "experienceLevel": "mid", "educationRequirements": []}';
      const parsed = JSON.parse(jsonString);

      return {
        requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
        preferredSkills: Array.isArray(parsed.preferredSkills) ? parsed.preferredSkills : [],
        keyResponsibilities: Array.isArray(parsed.keyResponsibilities) ? parsed.keyResponsibilities : [],
        experienceLevel: typeof parsed.experienceLevel === 'string' ? parsed.experienceLevel : 'mid',
        educationRequirements: Array.isArray(parsed.educationRequirements) ? parsed.educationRequirements : []
      };
    } catch (parseError) {
      console.error("Error parsing job description analysis:", parseError);
      return {
        requiredSkills: ["Communication", "Problem Solving", "Teamwork"],
        preferredSkills: ["Leadership", "Project Management"],
        keyResponsibilities: ["Collaborate with team", "Deliver projects", "Maintain quality"],
        experienceLevel: "mid",
        educationRequirements: ["Bachelor's degree"]
      };
    }
  } catch (error) {
    console.error("Error analyzing job description:", error);
    throw new Error("Failed to analyze job description. Please try again later.");
  }
}

// Suggest skills based on job title and experience
export async function suggestSkills(jobTitle: string, experience: string): Promise<string[]> {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured");
  }
  
  try {
    const model = getModel();
    
    const prompt = `
    Suggest 10 relevant skills for a ${jobTitle} role based on the following experience:
    
    Experience: ${experience}
    
    Provide the skills in a JSON array format containing only the skill names, nothing else.
    For example: ["Skill 1", "Skill 2", "Skill 3", ...]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract the JSON array from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : '[]';
      const parsed = JSON.parse(jsonString);
      
      // Ensure we return an array of strings
      if (Array.isArray(parsed)) {
        return parsed.filter(skill => typeof skill === 'string').slice(0, 10);
      }
      
      return [];
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini response:", parseError);
      // Default skills if parsing fails
      return [
        "Communication",
        "Problem Solving",
        "Teamwork",
        "Time Management",
        "Leadership"
      ];
    }
  } catch (error) {
    console.error("Error suggesting skills:", error);
    throw new Error("Failed to suggest skills. Please try again later.");
  }
}