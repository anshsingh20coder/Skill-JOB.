const fs = require('fs');
const path = require('path');
const { extractSkillsFromText } = require('../../src/ai/skillExtractor');
const { analyzeSkillGap } = require('../../src/ai/matchingEngine');
const { isSkillEquivalent, getCanonicalSkillName } = require('../../src/ai/skillDictionary');

async function runEvaluation() {
  console.log('================================================================');
  console.log('       SKILLGAP AI - MODEL & ALGORITHM EVALUATION SUITE         ');
  console.log('================================================================\n');

  const answerKeyPath = path.resolve(__dirname, '../../../test-dataset/answer_key.json');
  if (!fs.existsSync(answerKeyPath)) {
    console.error(`Error: Answer key file not found at ${answerKeyPath}`);
    process.exit(1);
  }

  const answerKey = JSON.parse(fs.readFileSync(answerKeyPath, 'utf-8'));
  const testCases = answerKey.testCases;

  console.log(`Loaded Answer Key: Version ${answerKey.version}`);
  console.log(`Total Verified Test Cases: ${testCases.length}\n`);

  let totalExpectedMissing = 0;
  let totalCorrectlyIdentifiedMissing = 0;
  let totalPredictedMissing = 0;
  let totalFalsePositives = 0;
  let totalFalseNegatives = 0;

  let totalSynonymChecks = 0;
  let passedSynonymChecks = 0;

  let totalEvidenceChecks = 0;
  let passedEvidenceChecks = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    console.log(`----------------------------------------------------------------`);
    console.log(`[TEST CASE ${i + 1}/${testCases.length}] ${tc.id}: ${tc.name}`);
    console.log(`Description: ${tc.description}`);
    console.log(`----------------------------------------------------------------`);

    // 1. Synonym matching tests
    if (tc.synonymChecks && tc.synonymChecks.length > 0) {
      console.log('  ▸ Checking Skill Synonym Normalization:');
      for (const sc of tc.synonymChecks) {
        totalSynonymChecks++;
        const isEq = isSkillEquivalent(sc.inputA, sc.inputB);
        const canonA = getCanonicalSkillName(sc.inputA);
        const canonB = getCanonicalSkillName(sc.inputB);
        const passed = isEq === sc.shouldMatch;
        if (passed) passedSynonymChecks++;
        console.log(`    ${passed ? '✓' : '✗'} "${sc.inputA}" == "${sc.inputB}" -> Canonical: "${canonA}" (Match: ${isEq})`);
      }
    }

    // 2. Read documents
    const jdFilePath = path.resolve(__dirname, '../../../', tc.jdFile);
    const resumeFilePath = path.resolve(__dirname, '../../../', tc.resumeFile);

    const jdText = fs.readFileSync(jdFilePath, 'utf-8');
    const resumeText = fs.readFileSync(resumeFilePath, 'utf-8');

    // 3. Extract skills
    const jdSkillsResult = extractSkillsFromText(jdText, 'job_description');
    const resumeSkillsResult = extractSkillsFromText(resumeText, 'resume');

    // 4. Run gap analysis
    const gapAnalysis = analyzeSkillGap({
      resumeSkills: resumeSkillsResult.extractedSkills,
      jdSkills: jdSkillsResult.extractedSkills,
      resumeText,
      jdText,
      jdExperienceReqs: jdSkillsResult.experienceRequirements,
      resumeExtractionConfidence: 100,
    });

    const predictedMissingNames = gapAnalysis.missingSkills.map(s => s.canonicalName);
    const expectedMissingNames = tc.expectedMissingSkills;

    // 5. Check Evidence Traceability (CRITICAL REQUIREMENT)
    console.log('  ▸ Checking Evidence Traceability for Missing Skills:');
    for (const ms of gapAnalysis.missingSkills) {
      totalEvidenceChecks++;
      const sentence = ms.jdEvidenceSentence;
      const isTraceableInJd = jdText.toLowerCase().includes(sentence.toLowerCase().trim().slice(0, 35));
      if (isTraceableInJd) passedEvidenceChecks++;
      console.log(`    ${isTraceableInJd ? '✓ TRACEABLE' : '✗ FAILED'}: [${ms.canonicalName}] Evidence: "${sentence.slice(0, 75)}..."`);
    }

    // 6. Compare with Judge-made Answer Key
    const tpList = predictedMissingNames.filter(name => expectedMissingNames.includes(name));
    const fpList = predictedMissingNames.filter(name => !expectedMissingNames.includes(name));
    const fnList = expectedMissingNames.filter(name => !predictedMissingNames.includes(name));

    const tp = tpList.length;
    const fp = fpList.length;
    const fn = fnList.length;

    totalExpectedMissing += expectedMissingNames.length;
    totalCorrectlyIdentifiedMissing += tp;
    totalPredictedMissing += predictedMissingNames.length;
    totalFalsePositives += fp;
    totalFalseNegatives += fn;

    const caseAgreement = expectedMissingNames.length > 0
      ? (tp / expectedMissingNames.length) * 100
      : 100;

    console.log(`  ▸ Test Case Metrics:`);
    console.log(`    - Expected Missing Skills: [ ${expectedMissingNames.join(', ')} ]`);
    console.log(`    - Detected Missing Skills: [ ${predictedMissingNames.join(', ')} ]`);
    console.log(`    - Correct Matches (TP):    ${tp}`);
    console.log(`    - False Positives (FP):    ${fp} ${fpList.length ? `(${fpList.join(', ')})` : ''}`);
    console.log(`    - False Negatives (FN):    ${fn} ${fnList.length ? `(${fnList.join(', ')})` : ''}`);
    console.log(`    - Case Agreement:          ${caseAgreement.toFixed(1)}%\n`);
  }

  // Calculate Overall Benchmark Metrics
  const agreement = (totalCorrectlyIdentifiedMissing / totalExpectedMissing) * 100;
  const precision = totalPredictedMissing > 0 ? totalCorrectlyIdentifiedMissing / totalPredictedMissing : 0;
  const recall = totalExpectedMissing > 0 ? totalCorrectlyIdentifiedMissing / totalExpectedMissing : 0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const synonymAccuracy = (passedSynonymChecks / totalSynonymChecks) * 100;
  const evidenceTraceability = (passedEvidenceChecks / totalEvidenceChecks) * 100;

  console.log('================================================================');
  console.log('              FINAL BENCHMARK EVALUATION RESULTS                ');
  console.log('================================================================');
  console.log(`Total Expected Missing Skills:       ${totalExpectedMissing}`);
  console.log(`Correctly Identified Missing (TP):   ${totalCorrectlyIdentifiedMissing}`);
  console.log(`False Positives (FP):                ${totalFalsePositives}`);
  console.log(`False Negatives (FN):                ${totalFalseNegatives}`);
  console.log(`Synonym Equivalence Accuracy:        ${synonymAccuracy.toFixed(1)}% (${passedSynonymChecks}/${totalSynonymChecks})`);
  console.log(`Evidence Traceability Rate:          ${evidenceTraceability.toFixed(1)}% (${passedEvidenceChecks}/${totalEvidenceChecks})`);
  console.log('----------------------------------------------------------------');
  console.log(`🎯 MISSING-SKILL AGREEMENT:           ${agreement.toFixed(2)}% (Target: ≥ 70.0%)`);
  console.log(`📊 PRECISION:                        ${(precision * 100).toFixed(2)}%`);
  console.log(`📈 RECALL:                           ${(recall * 100).toFixed(2)}%`);
  console.log(`⭐ F1 SCORE:                         ${(f1 * 100).toFixed(2)}%`);
  console.log('================================================================');

  if (agreement >= 70 && evidenceTraceability === 100) {
    console.log('✅ EVALUATION PASSED: Exceeded minimum 70% agreement requirement with 100% evidence traceability.');
    process.exit(0);
  } else {
    console.error('❌ EVALUATION FAILED: Requirements not satisfied.');
    process.exit(1);
  }
}

runEvaluation().catch(err => {
  console.error('Fatal evaluation runner error:', err);
  process.exit(1);
});
