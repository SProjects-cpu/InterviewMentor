/**
 * Simple In-Memory Database for Development
 * This provides a basic simulation when MongoDB is not available
 */

// In-memory storage
const memoryDB = {
  users: new Map(),
  profiles: new Map(),
  quizResults: new Map(),
  careerGuidance: new Map(),
  codingChallenges: new Map(),
  userSolutions: new Map(),
  resumes: new Map(),
};

// Auto-increment counters
const counters = {
  users: 0,
  profiles: 0,
  quizResults: 0,
  careerGuidance: 0,
  codingChallenges: 0,
  userSolutions: 0,
  resumes: 0,
};

/**
 * Simple User model simulation
 */
class MemoryUser {
  constructor(data) {
    this._id = data._id || data.username || `user_${++counters.users}`;
    this.username = data.username;
    this.password = data.password;
    this.email = data.email || null;
    this.created_at = data.created_at || new Date();
  }

  static async findOne(query) {
    for (const [id, user] of memoryDB.users) {
      if (query.username && user.username === query.username) {
        return user;
      }
      if (query._id && user._id === query._id) {
        return user;
      }
    }
    return null;
  }

  async save() {
    memoryDB.users.set(this._id, this);
    console.log(`💾 Saved user to memory: ${this.username}`);
    return this;
  }

  // Getter for id (GraphQL compatibility)
  get id() {
    return this._id;
  }
}

/**
 * Simple ProfileDetails model simulation
 */
class MemoryProfileDetails {
  constructor(data) {
    this._id = data._id || `profile_${++counters.profiles}`;
    this.user_id = data.user_id;
    this.full_name = data.full_name;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.bio = data.bio;
    this.skills = data.skills;
    this.experience = data.experience;
    this.education = data.education;
    this.certifications = data.certifications;
    this.profile_picture = data.profile_picture;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  static async findOneAndUpdate(query, update, options = {}) {
    let profile = null;
    for (const [id, p] of memoryDB.profiles) {
      if (query.user_id && p.user_id === query.user_id) {
        profile = p;
        break;
      }
    }

    if (!profile && options.upsert) {
      profile = new MemoryProfileDetails({ ...update, _id: `profile_${++counters.profiles}` });
    } else if (profile) {
      Object.assign(profile, update);
      profile.updated_at = new Date();
    }

    if (profile) {
      memoryDB.profiles.set(profile._id, profile);
      console.log(`💾 Saved profile to memory: ${profile._id}`);
    }

    return profile;
  }

  get id() {
    return this._id;
  }
}

/**
 * Simple QuizResult model simulation
 */
class MemoryQuizResult {
  constructor(data) {
    this._id = data._id || `quiz_${++counters.quizResults}`;
    this.user_id = data.user_id;
    this.test_type = data.test_type;
    this.category = data.category;
    this.score = data.score;
    this.total_questions = data.total_questions;
    this.correct_answers = data.correct_answers;
    this.time_taken = data.time_taken;
    this.answers = data.answers;
    this.completed_at = data.completed_at || new Date();
    this.created_at = data.created_at || new Date();
  }

  async save() {
    memoryDB.quizResults.set(this._id, this);
    console.log(`💾 Saved quiz result to memory: ${this._id}`);
    return this;
  }

  get id() {
    return this._id;
  }
}

/**
 * Simple CareerGuidance model simulation
 */
class MemoryCareerGuidance {
  constructor(data) {
    this._id = data._id || `career_${++counters.careerGuidance}`;
    this.user_id = data.user_id;
    this.interests = data.interests;
    this.skills = data.skills;
    this.experience_level = data.experience_level;
    this.preferred_industries = data.preferred_industries;
    this.career_goals = data.career_goals;
    this.assessment_results = data.assessment_results;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  async save() {
    memoryDB.careerGuidance.set(this._id, this);
    console.log(`💾 Saved career guidance to memory: ${this._id}`);
    return this;
  }

  get id() {
    return this._id;
  }
}

/**
 * Simple UserSolution model simulation
 */
class MemoryUserSolution {
  constructor(data) {
    this._id = data._id || `solution_${++counters.userSolutions}`;
    this.user_id = data.user_id;
    this.challenge_id = data.challenge_id;
    this.language = data.language;
    this.code = data.code;
    this.status = data.status;
    this.score = data.score;
    this.test_cases_passed = data.test_cases_passed;
    this.total_test_cases = data.total_test_cases;
    this.execution_time = data.execution_time;
    this.created_at = data.created_at || new Date();
  }

  async save() {
    memoryDB.userSolutions.set(this._id, this);
    console.log(`💾 Saved user solution to memory: ${this._id}`);
    return this;
  }

  get id() {
    return this._id;
  }
}

/**
 * Simple Resume model simulation
 */
class MemoryResume {
  constructor(data) {
    this._id = data._id || `resume_${++counters.resumes}`;
    this.userId = data.userId;
    this.title = data.title;
    this.template = data.template || 'stockholm';
    this.content = data.content || {};
    this.atsScore = data.atsScore || null;
    this.atsSuggestions = data.atsSuggestions || [];
    this.atsKeywordMatches = data.atsKeywordMatches || 0;
    this.atsMissingKeywords = data.atsMissingKeywords || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static findByUserId(userId) {
    const resumes = [];
    for (const [id, resume] of memoryDB.resumes) {
      if (resume.userId === userId) {
        resumes.push(resume);
      }
    }
    return resumes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  static findById(id) {
    return memoryDB.resumes.get(id) || null;
  }

  static create(data) {
    const resume = new MemoryResume(data);
    memoryDB.resumes.set(resume._id, resume);
    console.log(`💾 Created resume in memory: ${resume._id}`);
    return resume;
  }

  static update(id, updateData) {
    const resume = memoryDB.resumes.get(id);
    if (!resume) return null;

    Object.assign(resume, updateData);
    resume.updatedAt = new Date();
    memoryDB.resumes.set(id, resume);
    console.log(`💾 Updated resume in memory: ${id}`);
    return resume;
  }

  static delete(id) {
    const resume = memoryDB.resumes.get(id);
    if (!resume) return null;

    memoryDB.resumes.delete(id);
    console.log(`💾 Deleted resume from memory: ${id}`);
    return resume;
  }

  get id() {
    return this._id;
  }
}

/**
 * Initialize memory database with some sample data
 */
function initializeMemoryDB() {
  console.log('🧠 Initializing in-memory database...');
  
  // Clear existing data
  Object.keys(memoryDB).forEach(key => {
    memoryDB[key].clear();
  });
  
  // Reset counters
  Object.keys(counters).forEach(key => {
    counters[key] = 0;
  });
  
  console.log('✅ In-memory database initialized');
}

/**
 * Get memory database statistics
 */
function getMemoryDBStats() {
  const stats = {};
  Object.keys(memoryDB).forEach(collection => {
    stats[collection] = memoryDB[collection].size;
  });
  return {
    collections: stats,
    totalRecords: Object.values(stats).reduce((sum, count) => sum + count, 0)
  };
}

module.exports = {
  MemoryUser,
  MemoryProfileDetails,
  MemoryQuizResult,
  MemoryCareerGuidance,
  MemoryUserSolution,
  MemoryResume,
  initializeMemoryDB,
  getMemoryDBStats,
  memoryDB
};
