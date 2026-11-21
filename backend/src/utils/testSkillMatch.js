const { resolveCanonicalSkill } = require('../ai/skillDictionary');
const { extractSkillsFromText } = require('../ai/skillExtractor');
const { matchResumeAgainstJobDescription } = require('../ai/evidenceEngine');
const { calculateSkillGapScores } = require('../ai/scoringEngine');
const { generateTwoWeekLearningPlan } = require('../ai/learningPlanGenerator');

console.log('Testing Canonical Skill Resolution:');
console.log('ReactJS ->', resolveCanonicalSkill('ReactJS'));
console.log('React.js ->', resolveCanonicalSkill('React.js'));
console.log('nodejs ->', resolveCanonicalSkill('nodejs'));
console.log('k8s ->', resolveCanonicalSkill('k8s'));
console.log('PostgreSQL ->', resolveCanonicalSkill('postgres'));

const sampleResume = `
Jane Doe - Senior Full Stack Engineer
Experience with React, TypeScript, Node.js, Express.js, and MongoDB.
Built REST APIs and scalable web applications. Proficient with Git, HTML5, CSS3, and Jest for automated testing.
`;

const sampleJD = `
Job Title: Senior Cloud Full Stack Engineer
Requirements:
- Must have at least 4 years of experience with React, TypeScript, and Node.js.
- Strong proficiency with PostgreSQL and relational database design is required.
- Hands-on experience with Docker and containerized deployments is required.
- Experience with Kubernetes and AWS (EC2, S3) is strongly preferred.
`;

const resumeExtracted = extractSkillsFromText(sampleResume, false);
const jdExtracted = extractSkillsFromText(sampleJD, true);

console.log('\nExtracted Resume Skills:', resumeExtracted.skills.map(s => s.canonicalName));
console.log('Extracted JD Skills:', jdExtracted.skills.map(s => `${s.canonicalName} (${s.priority})`));

const match = matchResumeAgainstJobDescription(resumeExtracted.skills, jdExtracted.skills, jdExtracted.sentences);

console.log('\nMatched Skills:', match.matchedSkills.map(s => s.canonicalName));
console.log('Missing Skills with JD Evidence:');
match.missingSkills.forEach(m => {
  console.log(`- ${m.canonicalName} [${m.priority}]: "${m.jdEvidence}"`);
});

const scores = calculateSkillGapScores(match.matchedSkills, match.missingSkills);
console.log('\nScores:', scores);

const plan = generateTwoWeekLearningPlan(match.missingSkills);
console.log('\n14-Day Plan Target Skills:', plan.targetSkills);
console.log('Day 1:', plan.days[0].topic);
console.log('Day 14:', plan.days[13].topic);
