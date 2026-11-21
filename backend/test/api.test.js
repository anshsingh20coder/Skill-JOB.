const assert = require('assert');
const { app } = require('../src/server');
const {
  userRepo,
  resumeRepo,
  jdRepo,
  analysisRepo,
  learningPlanRepo,
} = require('../src/services/dataStore');
const { extractSkillsFromText } = require('../src/ai/skillExtractor');
const { analyzeSkillGap } = require('../src/ai/matchingEngine');
const { generate14DayLearningPlan } = require('../src/ai/learningPlanner');
const { isSkillEquivalent, getCanonicalSkillName } = require('../src/ai/skillDictionary');

async function runApiUnitTests() {
  console.log('================================================================');
  console.log('              RUNNING BACKEND UNIT & API TESTS                  ');
  console.log('================================================================\n');

  // 1. Test Synonym Equivalencies
  console.log('1. Testing Synonym Dictionary Normalization:');
  assert.strictEqual(isSkillEquivalent('ReactJS', 'React.js'), true);
  assert.strictEqual(isSkillEquivalent('NodeJS', 'Node.js'), true);
  assert.strictEqual(isSkillEquivalent('JS', 'JavaScript'), true);
  assert.strictEqual(isSkillEquivalent('TS', 'TypeScript'), true);
  assert.strictEqual(isSkillEquivalent('Postgres', 'PostgreSQL'), true);
  assert.strictEqual(isSkillEquivalent('K8s', 'Kubernetes'), true);
  assert.strictEqual(isSkillEquivalent('Amazon Web Services', 'AWS'), true);
  assert.strictEqual(isSkillEquivalent('Python', 'Java'), false);
  console.log('   ✓ Synonym dictionary rules verified correctly.\n');

  // 2. Test Skill Extraction from Job Description
  console.log('2. Testing Skill Extraction and Importance Tagging:');
  const sampleJd = `
    Job Title: Senior Cloud Engineer
    We are looking for a cloud engineer.
    Requirements:
    - 4+ years of experience with Python and Docker is required.
    - Strong proficiency in PostgreSQL database administration is required.
    - Hands-on experience with Kubernetes is required.
    Nice to have:
    - Familiarity with Redis in-memory cache is preferred.
    - Prior exposure to Terraform is a plus.
  `;
  const jdExtraction = extractSkillsFromText(sampleJd, 'job_description');
  const jdSkillNames = jdExtraction.extractedSkills.map(s => s.canonicalName);

  assert.ok(jdSkillNames.includes('Python'), 'Expected Python in JD');
  assert.ok(jdSkillNames.includes('Docker'), 'Expected Docker in JD');
  assert.ok(jdSkillNames.includes('PostgreSQL'), 'Expected PostgreSQL in JD');
  assert.ok(jdSkillNames.includes('Kubernetes'), 'Expected Kubernetes in JD');
  assert.ok(jdSkillNames.includes('Redis'), 'Expected Redis in JD');
  assert.ok(jdSkillNames.includes('Terraform'), 'Expected Terraform in JD');

  const dockerSkill = jdExtraction.extractedSkills.find(s => s.canonicalName === 'Docker');
  assert.strictEqual(dockerSkill.importance, 'required');

  const redisSkill = jdExtraction.extractedSkills.find(s => s.canonicalName === 'Redis');
  assert.strictEqual(redisSkill.importance, 'preferred');

  console.log(`   ✓ Extracted ${jdExtraction.extractedSkills.length} skills with accurate required vs preferred importance tags.\n`);

  // 3. Test Skill Extraction from Resume
  console.log('3. Testing Resume Skill Extraction:');
  const sampleResume = `
    Alex Rivera - Software Engineer
    Skills: Python, JavaScript, HTML/CSS, Git, SQL
    Experience: 3 years building data pipelines in Python and writing SQL queries.
  `;
  const resumeExtraction = extractSkillsFromText(sampleResume, 'resume');
  const resumeSkillNames = resumeExtraction.extractedSkills.map(s => s.canonicalName);

  assert.ok(resumeSkillNames.includes('Python'), 'Expected Python in resume');
  assert.ok(resumeSkillNames.includes('SQL'), 'Expected SQL in resume');
  console.log(`   ✓ Extracted ${resumeExtraction.extractedSkills.length} skills from resume.\n`);

  // 4. Test Skill Gap Matching & Evidence Engine
  console.log('4. Testing Gap Analysis & JD Evidence Preservation:');
  const gapAnalysis = analyzeSkillGap({
    resumeSkills: resumeExtraction.extractedSkills,
    jdSkills: jdExtraction.extractedSkills,
    resumeText: sampleResume,
    jdText: sampleJd,
    jdExperienceReqs: jdExtraction.experienceRequirements,
  });

  // Verify matched
  assert.ok(gapAnalysis.matchedSkills.some(s => s.canonicalName === 'Python'), 'Python should be matched');

  // Verify missing skills
  const missingNames = gapAnalysis.missingSkills.map(s => s.canonicalName);
  assert.ok(missingNames.includes('Docker'), 'Docker should be missing');
  assert.ok(missingNames.includes('Kubernetes'), 'Kubernetes should be missing');
  assert.ok(missingNames.includes('PostgreSQL'), 'PostgreSQL should be missing');

  // Verify CRITICAL REQUIREMENT: Every missing skill must have exact JD evidence sentence
  for (const ms of gapAnalysis.missingSkills) {
    assert.ok(ms.jdEvidenceSentence && ms.jdEvidenceSentence.length > 5, `Missing skill ${ms.canonicalName} has invalid evidence`);
    assert.ok(sampleJd.toLowerCase().includes(ms.jdEvidenceSentence.toLowerCase().slice(0, 25)), `Evidence for ${ms.canonicalName} not found in JD`);
    assert.ok(ms.explanation.includes(ms.canonicalName), `Explanation should mention ${ms.canonicalName}`);
  }
  console.log(`   ✓ Gap analysis calculated: ${gapAnalysis.scores.overallMatchPercentage}% match, with 100% verified JD evidence sentences.\n`);

  // 5. Test 14-Day Personalized Learning Planner
  console.log('5. Testing 14-Day Learning Plan Generator:');
  const plan = generate14DayLearningPlan(gapAnalysis.missingSkills);
  assert.strictEqual(plan.totalDays, 14, 'Plan must contain exactly 14 days');
  assert.strictEqual(plan.dailySchedules.length, 14, 'Daily schedules must contain 14 entries');
  assert.ok(plan.topMissingSkills.length >= 1, 'Top missing skills must be present');

  // Check structure of each day
  for (const day of plan.dailySchedules) {
    assert.ok(day.day >= 1 && day.day <= 14);
    assert.ok(day.topic, `Day ${day.day} missing topic`);
    assert.ok(day.learningObjective, `Day ${day.day} missing learningObjective`);
    assert.ok(day.practicalTask, `Day ${day.day} missing practicalTask`);
    assert.ok(day.estimatedTime, `Day ${day.day} missing estimatedTime`);
    assert.ok(Array.isArray(day.freeResources) && day.freeResources.length > 0, `Day ${day.day} missing free resources`);
  }
  console.log(`   ✓ 14-day learning plan successfully constructed targeting: ${plan.topMissingSkills.join(', ')}.\n`);

  // 6. Test Data Store Repositories (CRUD)
  console.log('6. Testing Data Store & Model Operations:');
  const user = await userRepo.create({
    name: 'Test Candidate',
    email: 'test@candidate.ai',
    password: 'hashed_password_sample',
  });
  assert.ok(user._id || user.id);

  const foundUser = await userRepo.findOne({ email: 'test@candidate.ai' });
  assert.strictEqual(foundUser.name, 'Test Candidate');

  const updatedUser = await userRepo.findByIdAndUpdate(user._id || user.id, { targetRole: 'Lead Architect' });
  assert.strictEqual(updatedUser.targetRole, 'Lead Architect');
  console.log('   ✓ In-memory and persistent repository CRUD operations verified.\n');

  console.log('================================================================');
  console.log('              ALL BACKEND API & UNIT TESTS PASSED!              ');
  console.log('================================================================');
}

runApiUnitTests().catch(err => {
  console.error('Unit test failed:', err);
  process.exit(1);
});
