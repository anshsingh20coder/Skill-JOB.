const { SKILL_DATABASE } = require('./skillDictionary');

/**
 * Builds a clear, transparent explanation for a missing skill based on JD evidence.
 */
function generateMissingSkillExplanation(skillName, importance, jdEvidenceSentence) {
  const cleanSkill = skillName.trim();
  const impLabel = importance === 'preferred' ? 'preferred' : 'required';

  return `${cleanSkill} is explicitly stated as a ${impLabel} qualification in the job description, but no corresponding experience or project evidence was detected in your resume text.`;
}

/**
 * Evaluates related skills to detect partially matched technologies.
 * e.g., Candidate knows React, JD asks for Next.js (related).
 * Candidate knows PostgreSQL, JD asks for MySQL (both relational SQL).
 */
function findRelatedSkills(resumeSkillsMap, jdSkillsMap) {
  const relatedMatches = [];
  const partiallyMatched = [];

  for (const [jdCanonical, jdSkill] of Object.entries(jdSkillsMap)) {
    // If not matched directly in resume
    if (!resumeSkillsMap[jdCanonical]) {
      const dbEntry = SKILL_DATABASE.find(s => s.canonical === jdCanonical);
      if (dbEntry && dbEntry.related) {
        for (const rel of dbEntry.related) {
          if (resumeSkillsMap[rel]) {
            relatedMatches.push({
              resumeSkill: rel,
              relatedJdSkill: jdCanonical,
              relationship: `Candidate has verified proficiency in ${rel}, which shares common foundational paradigms with ${jdCanonical}.`,
            });

            partiallyMatched.push({
              canonicalName: jdCanonical,
              resumeSkill: rel,
              jdSkill: jdCanonical,
              reason: `Found adjacent competency in ${rel}. Learning curve to adapt to ${jdCanonical} is significantly lower.`,
              jdEvidence: jdSkill.evidenceSentence,
            });
            break;
          }
        }
      }
    }
  }

  return { relatedMatches, partiallyMatched };
}

/**
 * Analyzes experience gaps between resume and JD requirements.
 */
function evaluateExperienceGaps(resumeText, jdExperienceReqs) {
  const gaps = [];
  const resumeYearsMatch = resumeText.match(/(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+experience|\s+working)?/i);
  const detectedCandidateYears = resumeYearsMatch ? parseInt(resumeYearsMatch[1], 10) : null;

  for (const req of jdExperienceReqs) {
    if (detectedCandidateYears !== null) {
      if (detectedCandidateYears < req.years) {
        gaps.push({
          requiredExperience: `${req.years}+ years (${req.mention})`,
          candidateExperience: `${detectedCandidateYears} years detected in resume`,
          gapDescription: `Job description specifies at least ${req.years} years of professional experience, whereas resume indicates approximately ${detectedCandidateYears} years.`,
          status: 'gap_detected',
        });
      } else {
        gaps.push({
          requiredExperience: `${req.years}+ years (${req.mention})`,
          candidateExperience: `${detectedCandidateYears} years detected in resume`,
          gapDescription: `Candidate experience level matches or exceeds the stated requirement.`,
          status: 'met',
        });
      }
    } else {
      gaps.push({
        requiredExperience: req.mention,
        candidateExperience: 'Unspecified / not explicitly parsed',
        gapDescription: `Job description specifies "${req.mention}". Ensure your resume clearly states your total years of hands-on experience.`,
        status: 'unknown',
      });
    }
  }

  return gaps;
}

/**
 * Generates actionable, evidence-based recommendations.
 */
function generateRecommendations(missingSkills, matchedSkills, roleTitle) {
  // Sort missing skills by importance (required first)
  const sortedMissing = [...missingSkills].sort((a, b) => {
    if (a.importance === 'required' && b.importance !== 'required') return -1;
    if (a.importance !== 'required' && b.importance === 'required') return 1;
    return 0;
  });

  // Top skills to learn first (max 5)
  const skillsToLearnFirst = sortedMissing.slice(0, 5).map(skill => ({
    skill: skill.canonicalName,
    reason: `Explicitly mentioned in the job description: "${skill.jdEvidenceSentence.substring(0, 110)}..."`,
    urgency: skill.importance === 'required' ? 'High (Prerequisite)' : 'Medium (Competitive Advantage)',
  }));

  // Resume improvement recommendations
  const resumeImprovements = [];
  if (missingSkills.length > 0) {
    const top2 = missingSkills.slice(0, 2).map(s => s.canonicalName).join(' and ');
    resumeImprovements.push({
      section: 'Skills / Technical Summary',
      currentDefect: `Absence of keywords: ${top2}`,
      suggestedBulletPoint: `If you have worked with ${top2} in personal labs or coursework, explicitly add a "Familiarity" or "Technologies" section listing them.`,
    });
  }

  resumeImprovements.push({
    section: 'Experience / Projects',
    currentDefect: 'Vague responsibility descriptions lacking measurable impact',
    suggestedBulletPoint: 'Format accomplishments using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]" (e.g., "Reduced API latency by 35% by implementing Redis caching and indexing MongoDB queries").',
  });

  resumeImprovements.push({
    section: 'Header & Contact',
    currentDefect: 'Generic title not tailored to target role',
    suggestedBulletPoint: `Align your top headline with the target position: "${roleTitle || 'Software Engineer'}" to optimize ATS scanning.`,
  });

  // Recommended Hands-on Projects
  const projectRecommendations = [];
  const topMissingNames = sortedMissing.slice(0, 3).map(s => s.canonicalName);

  if (topMissingNames.length > 0) {
    projectRecommendations.push({
      title: `Full-Stack Production System featuring ${topMissingNames.slice(0, 2).join(' & ')}`,
      skillsTargeted: topMissingNames.slice(0, 2),
      description: `Architect and deploy an end-to-end cloud application integrating ${topMissingNames[0]}${topMissingNames[1] ? ` and ${topMissingNames[1]}` : ''}. Implement automated CI/CD testing, containerization, and persistent storage.`,
      portfolioImpact: 'Directly validates practical competencies in the missing job requirements on your GitHub portfolio.',
    });
  }

  projectRecommendations.push({
    title: 'Microservices REST & Real-Time Event Dashboard',
    skillsTargeted: ['REST APIs', 'System Design', 'Docker'],
    description: 'Build a decoupled backend service with rate-limiting, authentication, and Docker containerized deployment.',
    portfolioImpact: 'Demonstrates distributed system understanding and enterprise software architecture standards.',
  });

  // Interview preparation questions
  const interviewPreparationTopics = sortedMissing.slice(0, 3).map(skill => ({
    topic: skill.canonicalName,
    sampleQuestion: `Explain how you would design a scalable architecture using ${skill.canonicalName}, and what performance trade-offs you would consider.`,
    keyConcepts: [
      `Core fundamentals of ${skill.canonicalName}`,
      `Handling concurrency and error states`,
      `Debugging and monitoring in production`
    ],
  }));

  // Overall job readiness tips
  const jobReadinessTips = [
    'Tailor your resume headline and bullet points to match the primary keywords in the JD.',
    'Prepare concrete STAR (Situation, Task, Action, Result) stories for technical challenges.',
    'Publish code repositories with clean README files and interactive demo links.',
    'Review system design fundamentals and asynchronous data workflows before technical screens.'
  ];

  return {
    skillsToLearnFirst,
    resumeImprovements,
    projectRecommendations,
    interviewPreparationTopics,
    jobReadinessTips,
  };
}

/**
 * Core Skill Gap Matching & Scoring Engine
 */
function analyzeSkillGap({
  resumeSkills,
  jdSkills,
  resumeText = '',
  jdText = '',
  jdExperienceReqs = [],
  resumeExtractionConfidence = 100,
  roleTitle = 'Software Engineer'
}) {
  const resumeMap = {};
  for (const skill of resumeSkills) {
    resumeMap[skill.canonicalName] = skill;
  }

  const jdMap = {};
  for (const skill of jdSkills) {
    jdMap[skill.canonicalName] = skill;
  }

  const matchedSkills = [];
  const missingSkills = [];

  // Compare every skill required or preferred by JD
  for (const [canonical, jdSkill] of Object.entries(jdMap)) {
    const resumeSkill = resumeMap[canonical];

    if (resumeSkill) {
      // Matched!
      const isSynonym = resumeSkill.originalExtractedName.toLowerCase() !== jdSkill.originalExtractedName.toLowerCase();

      matchedSkills.push({
        canonicalName: canonical,
        originalResumeName: resumeSkill.originalExtractedName,
        originalJdName: jdSkill.originalExtractedName,
        category: jdSkill.category || resumeSkill.category || 'General',
        importance: jdSkill.importance || 'required',
        matchStatus: isSynonym ? 'synonym' : 'exact',
        confidenceScore: Math.min(resumeSkill.confidenceScore || 95, jdSkill.confidenceScore || 95),
        resumeEvidenceSentence: resumeSkill.evidenceSentence || '',
        jdEvidenceSentence: jdSkill.evidenceSentence || '',
        sourceLocation: `JD line ${jdSkill.sourceLineNumber || 1} vs Resume line ${resumeSkill.sourceLineNumber || 1}`,
      });
    } else {
      // MISSING SKILL
      // CRITICAL REQUIREMENT: Must have verified JD evidence sentence.
      // If no valid JD evidence exists, do not fabricate or present as verified missing skill.
      if (jdSkill.evidenceSentence && jdSkill.evidenceSentence.trim().length > 3) {
        missingSkills.push({
          canonicalName: canonical,
          originalJdName: jdSkill.originalExtractedName,
          category: jdSkill.category || 'General',
          importance: jdSkill.importance || 'required',
          confidenceScore: jdSkill.confidenceScore || 90,
          jdEvidenceSentence: jdSkill.evidenceSentence.trim(),
          explanation: generateMissingSkillExplanation(canonical, jdSkill.importance, jdSkill.evidenceSentence),
          suggestedAction: `Study ${canonical} and create a hands-on proof-of-concept project demonstrating core syntax and usage.`,
        });
      }
    }
  }

  // Find related and partially matched skills
  const { relatedMatches, partiallyMatched } = findRelatedSkills(resumeMap, jdMap);

  // Evaluate experience gaps
  const experienceGaps = evaluateExperienceGaps(resumeText, jdExperienceReqs);

  // Transparent scoring algorithm
  // Break down JD skills by importance
  const requiredJdSkills = Object.values(jdMap).filter(s => s.importance === 'required');
  const preferredJdSkills = Object.values(jdMap).filter(s => s.importance === 'preferred');

  const matchedRequiredCount = matchedSkills.filter(s => s.importance === 'required').length;
  const matchedPreferredCount = matchedSkills.filter(s => s.importance === 'preferred').length;

  const totalRequiredCount = requiredJdSkills.length;
  const totalPreferredCount = preferredJdSkills.length;

  // Calculate percentages
  const requiredMatchPercentage = totalRequiredCount > 0
    ? Math.round((matchedRequiredCount / totalRequiredCount) * 100)
    : 100;

  const preferredMatchPercentage = totalPreferredCount > 0
    ? Math.round((matchedPreferredCount / totalPreferredCount) * 100)
    : 100;

  // Overall match weighted: 75% required skills weight, 25% preferred skills weight
  let overallMatchPercentage = 0;
  if (totalRequiredCount > 0 && totalPreferredCount > 0) {
    overallMatchPercentage = Math.round((requiredMatchPercentage * 0.75) + (preferredMatchPercentage * 0.25));
  } else if (totalRequiredCount > 0) {
    overallMatchPercentage = requiredMatchPercentage;
  } else if (totalPreferredCount > 0) {
    overallMatchPercentage = preferredMatchPercentage;
  } else {
    overallMatchPercentage = 100;
  }

  // Recommendations
  const aiRecommendations = generateRecommendations(missingSkills, matchedSkills, roleTitle);

  return {
    scores: {
      overallMatchPercentage,
      requiredMatchPercentage,
      preferredMatchPercentage,
      totalMatchedSkills: matchedSkills.length,
      totalMissingSkills: missingSkills.length,
      totalSkillsInJD: Object.keys(jdMap).length,
      totalSkillsInResume: Object.keys(resumeMap).length,
      resumeExtractionConfidence,
    },
    matchedSkills,
    missingSkills,
    partiallyMatchedSkills: partiallyMatched,
    relatedSkills: relatedMatches,
    experienceGaps,
    aiRecommendations,
  };
}

module.exports = {
  analyzeSkillGap,
  generateMissingSkillExplanation,
  findRelatedSkills,
  evaluateExperienceGaps,
  generateRecommendations,
};
