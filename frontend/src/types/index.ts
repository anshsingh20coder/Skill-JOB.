export interface User {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead';
  createdAt?: string;
}

export interface ResumeMetadata {
  charCount?: number;
  wordCount?: number;
  lineCount?: number;
  twoColumnLayout?: boolean;
  tableDetected?: boolean;
  ocrUsed?: boolean;
}

export interface Resume {
  id: string;
  filename?: string;
  originalName: string;
  fileSize: number;
  pageCount: number;
  extractionConfidence: number;
  isScanned: boolean;
  hasWarnings: boolean;
  warnings?: string[];
  metadata?: ResumeMetadata;
  extractedSkillsCount?: number;
  extractedSkills?: Array<{
    canonicalName: string;
    originalName: string;
    category?: string;
  }>;
  previewText?: string;
  createdAt: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  experienceRequirement?: string;
  totalSkillsIdentified?: number;
  requiredSkillsCount?: number;
  requiredCount?: number;
  preferredSkillsCount?: number;
  preferredCount?: number;
  requiredSkills?: Array<{
    canonicalName: string;
    originalName: string;
    evidenceSentence: string;
  }>;
  preferredSkills?: Array<{
    canonicalName: string;
    originalName: string;
    evidenceSentence: string;
  }>;
  rawText?: string;
  createdAt: string;
}

export interface MatchedSkill {
  canonicalName: string;
  originalResumeName: string;
  originalJdName: string;
  category: string;
  importance: 'required' | 'preferred' | 'optional';
  matchStatus: 'exact' | 'synonym' | 'partial' | 'related';
  confidenceScore: number;
  resumeEvidenceSentence?: string;
  jdEvidenceSentence?: string;
  sourceLocation?: string;
}

export interface MissingSkill {
  canonicalName: string;
  originalJdName: string;
  category: string;
  importance: 'required' | 'preferred' | 'optional';
  confidenceScore: number;
  jdEvidenceSentence: string;
  explanation: string;
  suggestedAction?: string;
}

export interface PartiallyMatchedSkill {
  canonicalName: string;
  resumeSkill: string;
  jdSkill: string;
  reason: string;
  jdEvidence: string;
}

export interface RelatedSkill {
  resumeSkill: string;
  relatedJdSkill: string;
  relationship: string;
}

export interface ExperienceGap {
  requiredExperience: string;
  candidateExperience: string;
  gapDescription: string;
  status: 'met' | 'gap_detected' | 'unknown';
}

export interface AiRecommendations {
  skillsToLearnFirst: Array<{
    skill: string;
    reason: string;
    urgency: string;
  }>;
  resumeImprovements: Array<{
    section: string;
    currentDefect: string;
    suggestedBulletPoint: string;
  }>;
  projectRecommendations: Array<{
    title: string;
    skillsTargeted: string[];
    description: string;
    portfolioImpact: string;
  }>;
  interviewPreparationTopics: Array<{
    topic: string;
    sampleQuestion: string;
    keyConcepts: string[];
  }>;
  jobReadinessTips: string[];
}

export interface FreeResource {
  title: string;
  url: string;
  type: 'Documentation' | 'Interactive Tutorial' | 'Video' | 'Article' | 'CheatSheet';
}

export interface MiniProject {
  title: string;
  instructions: string;
  deliverable: string;
}

export interface DailySchedule {
  day: number;
  skill: string;
  topic: string;
  learningObjective: string;
  practicalTask: string;
  estimatedTime: string;
  freeResources: FreeResource[];
  miniProject?: MiniProject;
  isCompleted: boolean;
  notes?: string;
}

export interface LearningPlan {
  id: string;
  title: string;
  topMissingSkills: string[];
  totalDays: number;
  dailySchedules: DailySchedule[];
}

export interface AnalysisScores {
  overallMatchPercentage: number;
  requiredMatchPercentage: number;
  preferredMatchPercentage: number;
  totalMatchedSkills: number;
  totalMissingSkills: number;
  totalSkillsInJD: number;
  totalSkillsInResume: number;
  resumeExtractionConfidence: number;
}

export interface AnalysisResult {
  id: string;
  resumeInfo?: {
    id: string;
    name: string;
    extractionConfidence: number;
  };
  jdInfo?: {
    id: string;
    title: string;
    company: string;
  };
  scores: AnalysisScores;
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  partiallyMatchedSkills: PartiallyMatchedSkill[];
  relatedSkills: RelatedSkill[];
  experienceGaps: ExperienceGap[];
  aiRecommendations: AiRecommendations;
  learningPlan?: LearningPlan;
  createdAt: string;
}

export interface AnalysisHistoryItem {
  id: string;
  resumeName: string;
  jobTitle: string;
  company: string;
  overallMatchPercentage: number;
  requiredMatchPercentage: number;
  matchedCount: number;
  missingCount: number;
  createdAt: string;
}
