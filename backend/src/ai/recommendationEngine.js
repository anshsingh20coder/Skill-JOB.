/**
 * Structured AI Recommendation Engine
 * 
 * Generates transparent, non-hallucinatory career recommendations:
 * 1. Skills to learn first
 * 2. Concrete resume improvements
 * 3. Relevant portfolio projects bridging the gap
 * 4. Interview preparation topics with sample questions
 * 5. Practical job readiness assessment
 */

function generateRecommendations(matchedSkills, missingSkills, scores, resumeMetrics) {
  // 1. Prioritize skills to learn first
  const missingRequired = missingSkills.filter(s => s.priority === 'required');
  const missingPreferred = missingSkills.filter(s => s.priority === 'preferred');

  const skillsToLearnFirst = [
    ...missingRequired.map(s => ({
      skill: s.canonicalName,
      urgency: 'HIGH (Required Criterion)',
      reason: `Explicitly required in the JD. Lacking ${s.canonicalName} is the primary barrier to passing resume screening.`
    })),
    ...missingPreferred.map(s => ({
      skill: s.canonicalName,
      urgency: 'MEDIUM (Preferred Criterion)',
      reason: `Listed as preferred/plus. Mastering ${s.canonicalName} will give you a competitive edge over other applicants.`
    }))
  ].slice(0, 5);

  // 2. Resume Improvement Suggestions
  const resumeSuggestions = [];

  if (missingSkills.length > 0) {
    const topMissingNames = missingSkills.slice(0, 3).map(s => s.canonicalName).join(', ');
    resumeSuggestions.push({
      category: 'Keyword Alignment',
      suggestion: `If you have worked with ${topMissingNames} in academic coursework, personal projects, or internships, explicitly list them in your 'Technical Skills' section. Automated ATS parsers look for exact term occurrences.`
    });
  }

  resumeSuggestions.push({
    category: 'Quantifiable Impact (XYZ Formula)',
    suggestion: 'Rewrite bullet points using Google\'s XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]". For example: "Reduced API response latency by 35% through Redis caching and query indexing".'
  });

  if (resumeMetrics.isTwoColumn) {
    resumeSuggestions.push({
      category: 'ATS Layout Optimization',
      suggestion: 'Your resume uses a multi-column structure. While modern parsers can handle this, some legacy enterprise ATS systems misread column text. Consider keeping a clean single-column PDF variant for automated job portals.'
    });
  }

  resumeSuggestions.push({
    category: 'Contextual Proficiency',
    suggestion: 'Group your skills into clear subheadings (e.g., Languages, Frameworks, Cloud & DevOps, Databases) rather than a single comma-separated block. This improves human recruiter skim-readability.'
  });

  // 3. Relevant Portfolio Projects
  const projectRecommendations = [];
  const top1 = missingSkills[0]?.canonicalName;
  const top2 = missingSkills[1]?.canonicalName;

  if (top1 && top2) {
    projectRecommendations.push({
      title: `Full-Stack Enterprise App with ${top1} and ${top2}`,
      description: `Build an open-source web application incorporating ${top1} in the workflow and ${top2} for storage/orchestration. Document system architecture in README and include a live demo link.`,
      deliverables: ['GitHub Repository', 'Architecture Diagram', 'Automated CI/CD or Docker Compose setup']
    });
  } else if (top1) {
    projectRecommendations.push({
      title: `Hands-on Microservice Showcase featuring ${top1}`,
      description: `Develop a focused service demonstrating core best practices in ${top1}. Highlight unit test coverage and production configuration.`,
      deliverables: ['GitHub Repository', 'Comprehensive README', 'Unit & Integration Tests']
    });
  }

  projectRecommendations.push({
    title: 'Production Performance Benchmarking Utility',
    description: 'Create an automated benchmark tool measuring request latency and database throughput under concurrent load. Demonstrates mature engineering intuition.',
    deliverables: ['Benchmarking scripts', 'Performance analysis graph']
  });

  // 4. Interview Preparation Topics
  const interviewTopics = [];
  missingSkills.slice(0, 3).forEach(s => {
    interviewTopics.push({
      topic: `${s.canonicalName} Core Concepts & Trade-offs`,
      sampleQuestion: `Can you explain when you would choose ${s.canonicalName} over alternative technologies, and what trade-offs you have considered?`,
      talkingPoints: [
        `Explain the core problem that ${s.canonicalName} solves.`,
        `Be transparent about where you are in your learning trajectory: show evidence of hands-on mini-projects.`,
        `Bridge from your proven experience in related technologies (${s.relatedSkillsInResume?.join(', ') || 'foundational tools'}).`
      ]
    });
  });

  // 5. Job Readiness Assessment
  let readinessTier = 'Needs Preparation';
  let readinessCommentary = '';

  if (scores.requiredMatchScore >= 80) {
    readinessTier = 'Interview Ready (Strong Alignment)';
    readinessCommentary = 'Your background demonstrates strong overlap with the core mandatory qualifications. Focus on polishing system design answers and tailoring your portfolio.';
  } else if (scores.requiredMatchScore >= 50) {
    readinessTier = 'Targeted Sprint Required';
    readinessCommentary = 'You possess solid engineering foundations, but several explicit required skills are missing from your resume. Completing the 14-day learning plan will position you well for application.';
  } else {
    readinessTier = 'Foundational Upskilling Recommended';
    readinessCommentary = 'There is significant divergence between the current resume and this specific job profile. We recommend focusing on the top 3 required competencies before submitting an application.';
  }

  return {
    skillsToLearnFirst,
    resumeSuggestions,
    projectRecommendations,
    interviewTopics,
    readiness: {
      tier: readinessTier,
      commentary: readinessCommentary
    }
  };
}

module.exports = {
  generateRecommendations
};
