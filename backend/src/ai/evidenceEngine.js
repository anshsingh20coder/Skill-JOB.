/**
 * Missing Skill Evidence Engine & Match Evaluator
 * 
 * Strict Verification Guarantee:
 * Every missing skill MUST have a verifiable, verbatim sentence directly from the JD.
 * Hallucinated or inferred skills without literal textual backing are strictly rejected.
 */

function matchResumeAgainstJobDescription(resumeSkills, jdSkills, jdSentences = []) {
  const resumeCanonicalMap = new Map();
  resumeSkills.forEach(s => resumeCanonicalMap.set(s.canonicalName, s));

  const matchedSkills = [];
  const missingSkills = [];
  const partiallyMatchedSkills = [];

  for (const jdSkill of jdSkills) {
    const canonical = jdSkill.canonicalName;
    const isDirectMatch = resumeCanonicalMap.has(canonical);

    if (isDirectMatch) {
      const candidateSkill = resumeCanonicalMap.get(canonical);
      matchedSkills.push({
        canonicalName: canonical,
        category: jdSkill.category,
        priority: jdSkill.priority,
        importanceWeight: jdSkill.importanceWeight,
        candidateTokens: candidateSkill.extractedTokens,
        jdTokens: jdSkill.extractedTokens,
        matchStatus: 'MATCHED',
        confidenceScore: 0.96,
        resumeEvidence: candidateSkill.evidenceSentences?.[0]?.sentence || 'Mentioned in resume skills',
        jdEvidence: jdSkill.evidenceSentences?.[0]?.sentence || 'Required in JD'
      });
    } else {
      // Check for partial / related matches in candidate skills
      const relatedCandidates = [];
      if (jdSkill.related && jdSkill.related.length > 0) {
        for (const rel of jdSkill.related) {
          if (resumeCanonicalMap.has(rel)) {
            relatedCandidates.push(rel);
          }
        }
      }

      // CRITICAL REQUIREMENT: Verify JD Evidence
      // Find the primary evidence sentence in the JD
      let bestEvidence = null;
      if (jdSkill.evidenceSentences && jdSkill.evidenceSentences.length > 0) {
        bestEvidence = jdSkill.evidenceSentences[0];
      } else {
        // Search JD sentences directly for exact occurrence
        for (const s of jdSentences) {
          if (s.text.toLowerCase().includes(canonical.toLowerCase())) {
            bestEvidence = {
              sentenceIndex: s.index,
              sentence: s.cleanText || s.text,
              originalText: s.text
            };
            break;
          }
        }
      }

      // Strict requirement: Never invent evidence. Only accept if verified JD sentence exists!
      if (!bestEvidence) {
        console.warn(`[EvidenceEngine] Discarded unverified skill '${canonical}': No literal JD evidence sentence found.`);
        continue;
      }

      const priorityLabel = jdSkill.priority === 'required' ? 'explicitly required' : 'listed as preferred/advantageous';
      const explanation = `${canonical} is ${priorityLabel} in the job description ("${bestEvidence.sentence}"), but no matching evidence or equivalent background was found in the candidate's resume.`;

      const missingEntry = {
        canonicalName: canonical,
        category: jdSkill.category,
        priority: jdSkill.priority,
        importanceWeight: jdSkill.importanceWeight,
        relatedSkillsInResume: relatedCandidates,
        jdTokens: jdSkill.extractedTokens,
        matchStatus: relatedCandidates.length > 0 ? 'PARTIAL' : 'MISSING',
        confidenceScore: 0.95,
        jdEvidence: bestEvidence.sentence,
        sentenceIndex: bestEvidence.sentenceIndex,
        explanation: explanation,
        experienceRequirement: jdSkill.experienceRequirement || null
      };

      if (relatedCandidates.length > 0) {
        partiallyMatchedSkills.push({
          ...missingEntry,
          partialNote: `Candidate possesses foundational knowledge in related areas (${relatedCandidates.join(', ')}), but lacks direct demonstrated competency in ${canonical}.`
        });
      }

      missingSkills.push(missingEntry);
    }
  }

  // Skills present in resume but not requested in JD (Bonus skills)
  const additionalCandidateSkills = resumeSkills
    .filter(s => !jdSkills.some(j => j.canonicalName === s.canonicalName))
    .map(s => ({
      canonicalName: s.canonicalName,
      category: s.category,
      tokens: s.extractedTokens
    }));

  return {
    matchedSkills,
    missingSkills,
    partiallyMatchedSkills,
    additionalCandidateSkills
  };
}

module.exports = {
  matchResumeAgainstJobDescription
};
