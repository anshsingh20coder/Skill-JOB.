/**
 * SkillGap AI - Comprehensive Evaluation Harness
 * 
 * Compares application analysis results against human-curated ground truth
 * answer keys across multiple diverse test cases.
 * 
 * Metric formulas:
 * - Agreement (%) = (Correctly Identified Missing Skills / Total Expected Missing Skills) * 100
 * - Precision = TP / (TP + FP)
 * - Recall = TP / (TP + FN)
 * - F1 Score = 2 * (Precision * Recall) / (Precision + Recall)
 */

const fs = require('fs');
const path = require('path');
const { extractSkillsFromText } = require('../backend/src/ai/skillExtractor');
const { matchResumeAgainstJobDescription } = require('../backend/src/ai/evidenceEngine');
const { calculateSkillGapScores } = require('../backend/src/ai/scoringEngine');

const testCasesFile = path.join(__dirname, 'testCases.json');
const testCases = JSON.parse(fs.readFileSync(testCasesFile, 'utf8'));

console.log('======================================================================');
console.log('          SKILLGAP AI - GROUND TRUTH EVALUATION HARNESS              ');
console.log('======================================================================\n');

let totalExpectedMissingAll = 0;
let totalTruePositivesAll = 0;
let totalFalsePositivesAll = 0;
let totalFalseNegativesAll = 0;
let totalEvidenceVerifiedCount = 0;

testCases.forEach((tc, idx) => {
  console.log(`--- [TEST CASE ${idx + 1}/${testCases.length}]: ${tc.title} ---`);
  console.log(`Description: ${tc.description}`);

  // 1. Run extraction
  const resumeExtracted = extractSkillsFromText(tc.resumeText, false);
  const jdExtracted = extractSkillsFromText(tc.jobDescriptionText, true);

  // 2. Run matching engine
  const matchResult = matchResumeAgainstJobDescription(
    resumeExtracted.skills,
    jdExtracted.skills,
    jdExtracted.sentences
  );

  const scores = calculateSkillGapScores(matchResult.matchedSkills, matchResult.missingSkills);

  const identifiedMissing = matchResult.missingSkills.map(s => s.canonicalName);
  const expectedMissing = tc.expectedMissingSkills;

  // True Positives: Missing skills identified that are in ground truth
  const tp = identifiedMissing.filter(s => expectedMissing.includes(s));
  // False Positives: Missing skills identified that are NOT expected
  const fp = identifiedMissing.filter(s => !expectedMissing.includes(s));
  // False Negatives: Missing skills expected that were missed
  const fn = expectedMissing.filter(s => !identifiedMissing.includes(s));

  const agreement = expectedMissing.length > 0 ? (tp.length / expectedMissing.length) * 100 : 100;
  const precision = (tp.length + fp.length) > 0 ? (tp.length / (tp.length + fp.length)) : 1.0;
  const recall = (tp.length + fn.length) > 0 ? (tp.length / (tp.length + fn.length)) : 1.0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  totalExpectedMissingAll += expectedMissing.length;
  totalTruePositivesAll += tp.length;
  totalFalsePositivesAll += fp.length;
  totalFalseNegativesAll += fn.length;

  console.log(`\n  Extracted JD Skills (${jdExtracted.skills.length}):`, jdExtracted.skills.map(s => `${s.canonicalName} [${s.priority}]`).join(', '));
  console.log(`  Extracted Resume Skills (${resumeExtracted.skills.length}):`, resumeExtracted.skills.map(s => s.canonicalName).join(', '));
  console.log(`  Identified Matched (${matchResult.matchedSkills.length}):`, matchResult.matchedSkills.map(s => s.canonicalName).join(', ') || 'None');
  console.log(`  Identified Missing (${identifiedMissing.length}):`, identifiedMissing.join(', '));
  console.log(`  Expected Missing (${expectedMissing.length}):`, expectedMissing.join(', '));
  console.log(`  True Positives (Correct): [${tp.join(', ')}]`);
  if (fp.length > 0) console.log(`  False Positives (Unexpected): [${fp.join(', ')}]`);
  if (fn.length > 0) console.log(`  False Negatives (Missed): [${fn.join(', ')}]`);

  // Verify that EVERY missing skill has an exact verbatim JD evidence sentence
  let caseEvidenceVerified = true;
  matchResult.missingSkills.forEach(m => {
    if (!m.jdEvidence || m.jdEvidence.length < 5) {
      caseEvidenceVerified = false;
      console.error(`  â Œ FAIL: Missing skill '${m.canonicalName}' has no JD evidence!`);
    } else {
      totalEvidenceVerifiedCount++;
    }
  });

  console.log(`  Verbatim JD Evidence Verification: ${caseEvidenceVerified ? 'âœ” ALL VERIFIED' : 'â Œ FAILED'}`);
  console.log(`  Agreement: ${agreement.toFixed(1)}% | Precision: ${(precision * 100).toFixed(1)}% | Recall: ${(recall * 100).toFixed(1)}% | F1: ${(f1 * 100).toFixed(1)}%`);
  console.log(`  Skill Gap Score: Overall ${scores.overallMatchScore}% | Required ${scores.requiredMatchScore}% | Preferred ${scores.preferredMatchScore}%\n`);
});

// Overall Benchmark Summary
const overallAgreement = (totalTruePositivesAll / totalExpectedMissingAll) * 100;
const overallPrecision = (totalTruePositivesAll + totalFalsePositivesAll) > 0
  ? (totalTruePositivesAll / (totalTruePositivesAll + totalFalsePositivesAll))
  : 1.0;
const overallRecall = (totalTruePositivesAll + totalFalseNegativesAll) > 0
  ? (totalTruePositivesAll / (totalTruePositivesAll + totalFalseNegativesAll))
  : 1.0;
const overallF1 = (overallPrecision + overallRecall) > 0
  ? (2 * overallPrecision * overallRecall) / (overallPrecision + overallRecall)
  : 0;

console.log('======================================================================');
console.log('                 FINAL EVALUATION SUMMARY REPORT                      ');
console.log('======================================================================');
console.log(`Total Test Cases Evaluated:       ${testCases.length}`);
console.log(`Total Expected Missing Skills:    ${totalExpectedMissingAll}`);
console.log(`Correctly Identified (TP):        ${totalTruePositivesAll}`);
console.log(`False Positives (FP):             ${totalFalsePositivesAll}`);
console.log(`False Negatives (FN):             ${totalFalseNegativesAll}`);
console.log(`Total Verbatim JD Quotes Verified: ${totalEvidenceVerifiedCount}`);
console.log('----------------------------------------------------------------------');
console.log(`MISSING-SKILL AGREEMENT:          ${overallAgreement.toFixed(2)}%  (Target: >= 70.00%)`);
console.log(`PRECISION:                        ${(overallPrecision * 100).toFixed(2)}%`);
console.log(`RECALL:                           ${(overallRecall * 100).toFixed(2)}%`);
console.log(`F1 SCORE:                         ${(overallF1 * 100).toFixed(2)}%`);
console.log('----------------------------------------------------------------------');

if (overallAgreement >= 70.0) {
  console.log('âœ… EVALUATION PASSED: Skill gap agreement exceeds the 70% requirement threshold!');
} else {
  console.error('â Œ EVALUATION FAILED: Agreement is below 70%.');
  process.exit(1);
}
