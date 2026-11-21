/**
 * 14-Day Personalized Learning Plan Generator
 * Prioritizes the top missing skills identified from the Job Description.
 */

// Curated verified free learning resources database for top skills
const RESOURCE_LIBRARY = {
  Docker: [
    { title: 'Docker Official Getting Started Guide', url: 'https://docs.docker.com/get-started/', type: 'Documentation' },
    { title: 'freeCodeCamp Docker Curriculum for Beginners', url: 'https://www.freecodecamp.org/news/what-is-docker-used-for-a-docker-container-tutorial-for-beginners/', type: 'Interactive Tutorial' },
    { title: 'Docker Cheat Sheet & CLI Commands', url: 'https://dockerlabs.collabnix.com/docker/cheatsheet/', type: 'CheatSheet' }
  ],
  Kubernetes: [
    { title: 'Kubernetes Official Tutorials (Interactive Katacoda/Killercoda)', url: 'https://kubernetes.io/docs/tutorials/', type: 'Interactive Tutorial' },
    { title: 'K8s Architecture & Pod Lifecycle - Kubernetes.io', url: 'https://kubernetes.io/docs/concepts/', type: 'Documentation' }
  ],
  'TypeScript': [
    { title: 'TypeScript for JavaScript Programmers Handbook', url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html', type: 'Documentation' },
    { title: 'TypeHero Interactive TypeScript Exercises', url: 'https://typehero.dev/', type: 'Interactive Tutorial' }
  ],
  'React': [
    { title: 'React Official Interactive Documentation', url: 'https://react.dev/learn', type: 'Documentation' },
    { title: 'Full Stack Open React Course - University of Helsinki', url: 'https://fullstackopen.com/en/part1', type: 'Interactive Tutorial' }
  ],
  'Next.js': [
    { title: 'Next.js App Router Foundations', url: 'https://nextjs.org/learn', type: 'Interactive Tutorial' },
    { title: 'Next.js Documentation & Server Actions', url: 'https://nextjs.org/docs', type: 'Documentation' }
  ],
  'Node.js': [
    { title: 'Node.js Official API Guides & Event Loop', url: 'https://nodejs.org/en/learn', type: 'Documentation' },
    { title: 'MDN Express & Node.js Tutorial', url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs', type: 'Interactive Tutorial' }
  ],
  'PostgreSQL': [
    { title: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/', type: 'Documentation' },
    { title: 'SQLBolt - Interactive SQL Lessons', url: 'https://sqlbolt.com/', type: 'Interactive Tutorial' }
  ],
  'MongoDB': [
    { title: 'MongoDB University Free Learning Path', url: 'https://learn.mongodb.com/', type: 'Interactive Tutorial' },
    { title: 'Mongoose Library Documentation', url: 'https://mongoosejs.com/docs/guide.html', type: 'Documentation' }
  ],
  'Redis': [
    { title: 'Redis University Free Courses', url: 'https://university.redis.com/', type: 'Interactive Tutorial' },
    { title: 'Redis Commands Reference Guide', url: 'https://redis.io/commands/', type: 'Documentation' }
  ],
  'AWS': [
    { title: 'AWS Skill Builder Free Digital Training', url: 'https://explore.skillbuilder.aws/', type: 'Interactive Tutorial' },
    { title: 'AWS Cloud Practitioner Architecture Essentials', url: 'https://aws.amazon.com/getting-started/', type: 'Documentation' }
  ],
  'CI/CD': [
    { title: 'GitHub Actions Documentation & Quickstart', url: 'https://docs.github.com/en/actions/quickstart', type: 'Documentation' },
    { title: 'Automated CI/CD Workflow Lab', url: 'https://lab.github.com/', type: 'Interactive Tutorial' }
  ],
  'Python': [
    { title: 'The Official Python Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'Documentation' },
    { title: 'freeCodeCamp Scientific Computing with Python', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', type: 'Interactive Tutorial' }
  ],
  'Unit Testing': [
    { title: 'Jest Testing Framework Documentation', url: 'https://jestjs.io/docs/getting-started', type: 'Documentation' },
    { title: 'Test-Driven Development (TDD) Fundamentals by Martin Fowler', url: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html', type: 'Article' }
  ],
  'GraphQL': [
    { title: 'GraphQL Official Introduction & Schema Guide', url: 'https://graphql.org/learn/', type: 'Documentation' },
    { title: 'Apollo Odyssey Free GraphQL Interactive Courses', url: 'https://www.apollographql.com/tutorials/', type: 'Interactive Tutorial' }
  ],
  'Microservices': [
    { title: 'Microservice Architecture Patterns by Chris Richardson', url: 'https://microservices.io/patterns/index.html', type: 'Documentation' },
    { title: 'Designing Event-Driven Systems by Martin Kleppmann', url: 'https://dataintensive.net/', type: 'Article' }
  ]
};

function getResourcesForSkill(skillName) {
  if (RESOURCE_LIBRARY[skillName]) {
    return RESOURCE_LIBRARY[skillName];
  }
  return [
    {
      title: `${skillName} Official Documentation & Reference`,
      url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official documentation tutorial')}`,
      type: 'Documentation'
    },
    {
      title: `roadmap.sh Developer Path for ${skillName}`,
      url: 'https://roadmap.sh',
      type: 'Interactive Tutorial'
    }
  ];
}

/**
 * Builds day-by-day learning tasks for a specific skill slice.
 */
function buildDaysForSkill(skillName, startDay, duration, stageTitle) {
  const days = [];
  const resources = getResourcesForSkill(skillName);

  for (let i = 0; i < duration; i++) {
    const dayNumber = startDay + i;
    let topic = '';
    let objective = '';
    let practicalTask = '';
    let estimatedTime = '1.5 - 2 Hours';
    let miniProject = null;

    if (i === 0) {
      topic = `${skillName} Foundations, Setup & Architecture`;
      objective = `Understand core paradigms, installation procedures, and mental model of ${skillName}.`;
      practicalTask = `Install required CLI/tooling, review official getting-started guide, and execute a working hello-world demonstration.`;
      miniProject = {
        title: `${skillName} Hello-World Environment`,
        instructions: `Set up local configuration files, run test execution, and verify outputs.`,
        deliverable: `Working local workspace configuration verified via terminal logs.`
      };
    } else if (i === 1) {
      topic = `Core Building Blocks & Essential Syntax in ${skillName}`;
      objective = `Master primary primitives, data structures, and configuration conventions.`;
      practicalTask = `Write modular examples demonstrating key functions, error handling, and parameterization.`;
      miniProject = {
        title: `Modular Utility Script`,
        instructions: `Construct a reusable utility or component applying ${skillName}'s idiomatic patterns.`,
        deliverable: `Clean, documented source code committed to a git branch.`
      };
    } else if (i === 2) {
      topic = `Real-world Integration with API & Storage`;
      objective = `Connect ${skillName} with a complementary backend service or persistent store.`;
      practicalTask = `Implement asynchronous data flow, exception handling, and input validation.`;
      miniProject = {
        title: `Integrated Service Prototype`,
        instructions: `Build an integration endpoint that processes requests using ${skillName}.`,
        deliverable: `Functional service script responding to curl or browser requests.`
      };
    } else if (i === 3) {
      topic = `Testing, Profiling & Best Practices`;
      objective = `Write automated unit checks, benchmark execution, and adhere to industry standards.`;
      practicalTask = `Create test suites covering standard cases and edge failure boundaries.`;
      miniProject = {
        title: `Automated Test & Validation Suite`,
        instructions: `Implement unit and integration tests with >80% code coverage.`,
        deliverable: `Passing test suite output report.`
      };
    } else {
      topic = `${skillName} Practical Production Mini-Project`;
      objective = `Consolidate learning into an impactful portfolio-ready repository.`;
      practicalTask = `Design, build, and document a standalone micro-app leveraging ${skillName}.`;
      miniProject = {
        title: `Production-Grade ${skillName} Service`,
        instructions: `Develop a complete application, write a comprehensive README.md, and include architectural diagrams.`,
        deliverable: `GitHub repository link ready to showcase to hiring managers.`
      };
    }

    days.push({
      day: dayNumber,
      skill: skillName,
      topic: `${stageTitle}: ${topic}`,
      learningObjective: objective,
      practicalTask,
      estimatedTime,
      freeResources: resources,
      miniProject,
      isCompleted: false,
      notes: ''
    });
  }

  return days;
}

/**
 * Generates the full 14-day schedule tailored to top missing skills.
 */
function generate14DayLearningPlan(missingSkills) {
  // Sort missing skills: required first
  const sorted = [...missingSkills].sort((a, b) => {
    if (a.importance === 'required' && b.importance !== 'required') return -1;
    if (a.importance !== 'required' && b.importance === 'required') return 1;
    return 0;
  });

  // Pick top 3 missing skills
  let top3 = sorted.slice(0, 3).map(s => s.canonicalName);

  // Fallback defaults if fewer than 3 skills missing
  if (top3.length === 0) {
    top3 = ['System Design', 'Docker', 'CI/CD'];
  } else if (top3.length === 1) {
    top3.push('Docker', 'System Design');
  } else if (top3.length === 2) {
    top3.push('System Design');
  }

  const dailySchedules = [];

  // Skill 1: Days 1 to 5 (Deep focus)
  const skill1Days = buildDaysForSkill(top3[0], 1, 5, `Phase 1 (${top3[0]})`);
  dailySchedules.push(...skill1Days);

  // Skill 2: Days 6 to 10 (Deep focus)
  const skill2Days = buildDaysForSkill(top3[1], 6, 5, `Phase 2 (${top3[1]})`);
  dailySchedules.push(...skill2Days);

  // Skill 3: Days 11 to 13 (Accelerated focus)
  const skill3Days = buildDaysForSkill(top3[2], 11, 3, `Phase 3 (${top3[2]})`);
  dailySchedules.push(...skill3Days);

  // Day 14: Capstone Integration Day
  dailySchedules.push({
    day: 14,
    skill: `${top3[0]} + ${top3[1]} + ${top3[2]}`,
    topic: 'Capstone Integration & Resume Keyword Update Day',
    learningObjective: 'Synthesize all three acquired competencies into a cohesive cloud-deployed project and update resume bullet points.',
    practicalTask: 'Deploy an integrated application combining all 3 skills to a free cloud hosting tier (e.g. Render, Vercel, Railway). Add the project and verified skills to your resume using the Google XYZ bullet format.',
    estimatedTime: '3 Hours',
    freeResources: [
      { title: 'Render Free Application Hosting Guide', url: 'https://render.com/docs', type: 'Documentation' },
      { title: 'Vercel Deployment Guide', url: 'https://vercel.com/docs', type: 'Documentation' }
    ],
    miniProject: {
      title: 'Full Capstone Deployment',
      instructions: 'Deploy your unified project, record a 2-minute Loom/video demo or live URL, and update your LinkedIn/Resume technical skills section.',
      deliverable: 'Live web link and updated PDF resume ready for job applications.'
    },
    isCompleted: false,
    notes: ''
  });

  return {
    topMissingSkills: top3,
    title: `14-Day Targeted Mastery Plan: ${top3.join(', ')}`,
    totalDays: 14,
    dailySchedules,
  };
}

module.exports = {
  generate14DayLearningPlan,
  RESOURCE_LIBRARY,
  getResourcesForSkill,
};
