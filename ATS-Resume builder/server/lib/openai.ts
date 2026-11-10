import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo_key" });

// Content enhancement for resume summaries
export async function enhanceSummary(summary: string, jobTitle: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not found, returning original summary");
    return summary;
  }

  try {
    const prompt = `
    You are a professional resume writer with expertise in enhancing professional summaries. 
    Improve the following resume summary for a ${jobTitle} position by:
    
    1. Making it more impactful with specific accomplishments
    2. Adding industry-relevant keywords
    3. Maintaining a professional tone
    4. Keeping it concise (under 500 characters)
    
    Original summary:
    ${summary}
    
    Enhanced summary:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    return response.choices[0].message.content?.trim() || summary;
  } catch (error) {
    console.error("Error enhancing summary:", error);
    return summary;
  }
}

// Simplify a resume summary
export async function simplifySummary(summary: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not found, returning original summary");
    return summary;
  }

  try {
    const prompt = `
    You are a professional resume writer with expertise in writing clear, concise summaries.
    Simplify the following resume summary by:
    
    1. Using simpler language
    2. Making it more direct and clear
    3. Reducing it to 2-3 sentences
    4. Maintaining key skills and experience
    
    Original summary:
    ${summary}
    
    Simplified summary:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    return response.choices[0].message.content?.trim() || summary;
  } catch (error) {
    console.error("Error simplifying summary:", error);
    return summary;
  }
}

// Calculate ATS score for a resume
export async function calculateATSScore(
  resumeContent: any, 
  jobDescription?: string
): Promise<{ score: number; suggestions: string[] }> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not found, returning default score");
    return { score: 75, suggestions: [] };
  }

  try {
    const prompt = `
    You are an expert ATS (Applicant Tracking System) analyzer. Evaluate this resume content and provide:
    1. An ATS compatibility score (0-100)
    2. 2-3 specific suggestions for improvement
    
    Resume content:
    ${JSON.stringify(resumeContent, null, 2)}
    
    ${jobDescription ? `Job Description: ${jobDescription}` : ''}
    
    Respond with JSON in this format:
    {
      "score": number,
      "suggestions": [string]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"score": 75, "suggestions": []}');
    return {
      score: Math.min(100, Math.max(0, result.score)),
      suggestions: result.suggestions || []
    };
  } catch (error) {
    console.error("Error calculating ATS score:", error);
    return { score: 75, suggestions: [] };
  }
}

// Suggest skills based on job title and experience
export async function suggestSkills(jobTitle: string, experience: string): Promise<string[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not found, returning default skills");
    return ["JavaScript", "React", "Node.js", "Communication", "Teamwork"];
  }

  try {
    const prompt = `
    You are a career advisor specializing in skill identification for resumes.
    Based on the job title "${jobTitle}" and the following experience, suggest 8-10 relevant technical and soft skills:
    
    Experience:
    ${experience}
    
    Respond with JSON in this format:
    {
      "skills": [string]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"skills": []}');
    return result.skills || [];
  } catch (error) {
    console.error("Error suggesting skills:", error);
    return ["JavaScript", "React", "Node.js", "Communication", "Teamwork"];
  }
}
