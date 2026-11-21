/**
 * Transparent Scoring Engine
 * 
 * Computes strictly verifiable match percentages based on explicit required and preferred
 * job criteria. Includes full arithmetic breakdown to ensure complete transparency.
 */

function calculateSkillGapScores(matchedSkills, missingSkills, extractionMetrics = {}) {
  const matchedRequired = matchedSkills.filter(s => s.priority === 'required');
  const matchedPreferred = matchedSkills.filter(s => s.priority === 'preferred');

  const missingRequired = missingSkills.filter(s => s.priority === 'required');
  const missingPreferred = missingSkills.filter(s => s.priority === 'preferred');

  const totalRequired = matchedRequired.length + missingRequired.length;
  const totalPreferred = matchedPreferred.length + missingPreferred.length;

  // Required skill match percentage
  const requiredMatchScore = totalRequired > 0
    ? Math.round((matchedRequired.length / totalRequired) * 100)
    : 100;

  // Preferred skill match percentage
  const preferredMatchScore = totalPreferred > 0
    ? Math.round((matchedPreferred.length / totalPreferred) * 100)
    : 100;

  // Weighted Overall Match percentage: Required skills weighted 75%, Preferred weighted 25%
  let overallMatchScore = 0;
  if (totalRequired > 0 && totalPreferred > 0) {
    overallMatchScore = Math.round(
      (requiredMatchScore * 0.75) + (preferredMatchScore * 0.25)
    );
  } else if (totalRequired > 0) {
    overallMatchScore = requiredMatchScore;
  } else if (totalPreferred > 0) {
    overallMatchScore = preferredMatchScore;
  } else {
    overallMatchScore = 100;
  }

  // Ensure bounds [0, 100]
  overallMatchScore = Math.min(100, Math.max(0, overallMatchScore));

  const extractionConfidence = Math.round((extractionMetrics.confidenceScore || 0.95) * 100);

  return {
    overallMatchScore,
    requiredMatchScore,
    preferredMatchScore,
    totalSkillsInJd: totalRequired + totalPreferred,
    totalMatched: matchedSkills.length,
    totalMissing: missingSkills.length,
    matchedRequiredCount: matchedRequired.length,
    totalRequiredCount: totalRequired,
    matchedPreferredCount: matchedPreferred.length,
    totalPreferredCount: totalPreferred,
    extractionConfidence,
    scoringBreakdown: {
      formula: 'Overall = (75% × Required Match Rate) + (25% × Preferred Match Rate)',
      requiredCalculation: `${matchedRequired.length} of ${totalRequired} required skills matched (${requiredMatchScore}%)`,
      preferredCalculation: `${matchedPreferred.length} of ${totalPreferred} preferred skills matched (${preferredMatchScore}%)`,
      disclaimer: 'Note: Skill match percentage indicates keyword and qualification overlap with the job specification, not a hiring guarantee.'
    }
  };
}

module.exports = {
  calculateSkillGapScores
};
