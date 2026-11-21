/**
 * Centralized Skill Synonym Dictionary & Classification Knowledge Base
 * Maps canonical names to categories, aliases, variations, and related skills.
 */

const SKILL_DATABASE = [
  // Programming Languages
  {
    canonical: 'JavaScript',
    category: 'Programming Languages',
    synonyms: ['javascript', 'js', 'es6', 'es2015', 'ecmascript', 'modern javascript', 'vanilla js'],
    related: ['TypeScript', 'Node.js', 'React', 'Frontend'],
    description: 'Core web scripting language standard for modern full-stack development.'
  },
  {
    canonical: 'TypeScript',
    category: 'Programming Languages',
    synonyms: ['typescript', 'ts'],
    related: ['JavaScript', 'Angular', 'React', 'Node.js'],
    description: 'Typed superset of JavaScript that compiles to plain JavaScript.'
  },
  {
    canonical: 'Python',
    category: 'Programming Languages',
    synonyms: ['python', 'py', 'python3', 'python 3', 'pythonic'],
    related: ['Django', 'FastAPI', 'Flask', 'Machine Learning', 'Pandas'],
    description: 'High-level multi-paradigm programming language popular in backend and AI.'
  },
  {
    canonical: 'Java',
    category: 'Programming Languages',
    synonyms: ['java', 'core java', 'j2ee', 'java 8', 'java 11', 'java 17', 'java 21', 'jdk'],
    related: ['Spring Boot', 'Spring', 'Hibernate', 'Kotlin'],
    description: 'Object-oriented language widely used in enterprise backend systems.'
  },
  {
    canonical: 'C#',
    category: 'Programming Languages',
    synonyms: ['c#', 'c-sharp', 'c sharp', 'csharp', '.net', 'dotnet', 'asp.net', '.net core'],
    related: ['Entity Framework', 'Azure', 'Microservices'],
    description: 'Modern, object-oriented language developed by Microsoft for .NET.'
  },
  {
    canonical: 'C++',
    category: 'Programming Languages',
    synonyms: ['c++', 'cpp', 'modern c++'],
    related: ['C', 'Systems Programming', 'Embedded Systems'],
    description: 'High-performance compiled language for systems and game development.'
  },
  {
    canonical: 'Go',
    category: 'Programming Languages',
    synonyms: ['go', 'golang', 'go-lang'],
    related: ['Docker', 'Kubernetes', 'Microservices', 'gRPC'],
    description: 'Statically typed, compiled language engineered by Google for concurrent distributed systems.'
  },
  {
    canonical: 'Rust',
    category: 'Programming Languages',
    synonyms: ['rust', 'rustlang'],
    related: ['WebAssembly', 'Systems Programming', 'C++'],
    description: 'Systems language focused on memory safety and high concurrency.'
  },
  {
    canonical: 'PHP',
    category: 'Programming Languages',
    synonyms: ['php', 'php7', 'php8'],
    related: ['Laravel', 'Symfony', 'WordPress', 'MySQL'],
    description: 'Server-side scripting language primarily suited for web development.'
  },
  {
    canonical: 'Ruby',
    category: 'Programming Languages',
    synonyms: ['ruby', 'ruby on rails', 'rails'],
    related: ['PostgreSQL', 'Web Development'],
    description: 'Dynamic, open source language with a focus on developer happiness.'
  },
  {
    canonical: 'SQL',
    category: 'Programming Languages',
    synonyms: ['sql', 'structured query language', 'ansi sql', 't-sql', 'pl/sql'],
    related: ['PostgreSQL', 'MySQL', 'Database Design'],
    description: 'Domain-specific language used in programming and managing relational databases.'
  },

  // Frontend Frameworks & Libraries
  {
    canonical: 'React',
    category: 'Frontend',
    synonyms: ['react', 'react.js', 'reactjs', 'react js', 'react framework', 'react library'],
    related: ['Redux', 'Next.js', 'JavaScript', 'TypeScript', 'HTML/CSS'],
    description: 'Leading declarative, component-based frontend library for web user interfaces.'
  },
  {
    canonical: 'Next.js',
    category: 'Frontend',
    synonyms: ['next.js', 'nextjs', 'next js', 'next'],
    related: ['React', 'SSR', 'TypeScript'],
    description: 'Full-stack React framework enabling server-side rendering and static web apps.'
  },
  {
    canonical: 'Vue.js',
    category: 'Frontend',
    synonyms: ['vue', 'vue.js', 'vuejs', 'vue 3', 'vue 2'],
    related: ['Nuxt.js', 'JavaScript', 'Pinia', 'Vuex'],
    description: 'Progressive JavaScript framework for building user interfaces.'
  },
  {
    canonical: 'Angular',
    category: 'Frontend',
    synonyms: ['angular', 'angularjs', 'angular 2+', 'angular.js', 'angular framework'],
    related: ['TypeScript', 'RxJS', 'Frontend Architecture'],
    description: 'Comprehensive enterprise-level TypeScript-based web application platform.'
  },
  {
    canonical: 'Tailwind CSS',
    category: 'Frontend',
    synonyms: ['tailwind', 'tailwind css', 'tailwindcss'],
    related: ['CSS', 'HTML', 'Responsive Web Design'],
    description: 'Utility-first CSS framework for rapid modern UI styling.'
  },
  {
    canonical: 'HTML/CSS',
    category: 'Frontend',
    synonyms: ['html', 'html5', 'css', 'css3', 'html/css', 'semantic html', 'web design'],
    related: ['Frontend', 'JavaScript', 'Responsive Design'],
    description: 'Foundational markup and styling languages of the World Wide Web.'
  },
  {
    canonical: 'Redux',
    category: 'Frontend',
    synonyms: ['redux', 'redux toolkit', 'rtk', 'react-redux'],
    related: ['React', 'State Management'],
    description: 'Predictable state container for JavaScript apps.'
  },
  {
    canonical: 'Sass/SCSS',
    category: 'Frontend',
    synonyms: ['sass', 'scss'],
    related: ['CSS', 'Tailwind CSS'],
    description: 'CSS preprocessor providing variables, nesting, and mixins.'
  },

  // Backend Frameworks & Runtimes
  {
    canonical: 'Node.js',
    category: 'Backend',
    synonyms: ['node.js', 'nodejs', 'node js', 'node runtime', 'node'],
    related: ['Express.js', 'JavaScript', 'TypeScript', 'NestJS'],
    description: 'Asynchronous event-driven JavaScript runtime built on Chrome V8 engine.'
  },
  {
    canonical: 'Express.js',
    category: 'Backend',
    synonyms: ['express', 'express.js', 'expressjs', 'express js'],
    related: ['Node.js', 'REST APIs', 'Middleware'],
    description: 'Fast, unopinionated, minimalist web framework for Node.js.'
  },
  {
    canonical: 'NestJS',
    category: 'Backend',
    synonyms: ['nestjs', 'nest.js', 'nest js'],
    related: ['Node.js', 'TypeScript', 'Angular Architecture'],
    description: 'Progressive Node.js framework for building efficient, scalable enterprise server apps.'
  },
  {
    canonical: 'Django',
    category: 'Backend',
    synonyms: ['django', 'django rest framework', 'drf'],
    related: ['Python', 'PostgreSQL', 'Web Development'],
    description: 'Batteries-included high-level Python web framework.'
  },
  {
    canonical: 'FastAPI',
    category: 'Backend',
    synonyms: ['fastapi', 'fast api'],
    related: ['Python', 'AsyncIO', 'REST APIs'],
    description: 'Modern, high-performance web framework for building APIs with Python 3.8+.'
  },
  {
    canonical: 'Spring Boot',
    category: 'Backend',
    synonyms: ['spring boot', 'spring', 'spring framework', 'springboot', 'spring mvc'],
    related: ['Java', 'Microservices', 'Hibernate'],
    description: 'Enterprise Java framework to create stand-alone production-grade applications.'
  },
  {
    canonical: 'Flask',
    category: 'Backend',
    synonyms: ['flask'],
    related: ['Python', 'Microservices'],
    description: 'Lightweight WSGI Python web application micro-framework.'
  },
  {
    canonical: 'REST APIs',
    category: 'Backend',
    synonyms: ['rest', 'restful', 'rest api', 'rest apis', 'restful apis', 'restful web services', 'web apis'],
    related: ['JSON', 'HTTP', 'API Design', 'GraphQL'],
    description: 'Architectural style for network-based hypermedia and distributed API design.'
  },
  {
    canonical: 'GraphQL',
    category: 'Backend',
    synonyms: ['graphql', 'apollo graphql', 'apollo client', 'relay'],
    related: ['REST APIs', 'Node.js', 'API Design'],
    description: 'Query language and server-side runtime for APIs prioritizing client data fetching.'
  },
  {
    canonical: 'gRPC',
    category: 'Backend',
    synonyms: ['grpc', 'protocol buffers', 'protobuf'],
    related: ['Microservices', 'Go', 'RPC'],
    description: 'High performance, open source universal RPC framework.'
  },

  // Databases & Caching
  {
    canonical: 'PostgreSQL',
    category: 'Database',
    synonyms: ['postgresql', 'postgres', 'psql', 'postgres db'],
    related: ['SQL', 'Relational Databases', 'Database Design'],
    description: 'Powerful, open source object-relational database system with strong ACID compliance.'
  },
  {
    canonical: 'MongoDB',
    category: 'Database',
    synonyms: ['mongodb', 'mongo', 'mongo db', 'mongoose', 'nosql document db'],
    related: ['NoSQL', 'Node.js', 'Express.js', 'MERN'],
    description: 'Document-oriented NoSQL database used for high volume data storage and flexible schemas.'
  },
  {
    canonical: 'MySQL',
    category: 'Database',
    synonyms: ['mysql', 'mariadb'],
    related: ['SQL', 'Relational Databases'],
    description: 'Widely used open source relational database management system.'
  },
  {
    canonical: 'Redis',
    category: 'Database',
    synonyms: ['redis', 'redis cache', 'in-memory cache', 'key-value store'],
    related: ['Caching', 'Backend Optimization', 'Session Store'],
    description: 'In-memory data structure store used as a database, cache, and message broker.'
  },
  {
    canonical: 'Elasticsearch',
    category: 'Database',
    synonyms: ['elasticsearch', 'elastic search', 'elk stack', 'opensearch'],
    related: ['Full-text Search', 'Logstash', 'Kibana'],
    description: 'Distributed, RESTful search and analytics engine.'
  },

  // Cloud & DevOps
  {
    canonical: 'Docker',
    category: 'DevOps & Cloud',
    synonyms: ['docker', 'containerization', 'containers', 'docker compose', 'dockerfile', 'containerized'],
    related: ['Kubernetes', 'CI/CD', 'Microservices'],
    description: 'Platform for developing, shipping, and running applications in isolated containers.'
  },
  {
    canonical: 'Kubernetes',
    category: 'DevOps & Cloud',
    synonyms: ['kubernetes', 'k8s', 'k8s cluster', 'kubectl', 'container orchestration'],
    related: ['Docker', 'DevOps', 'Cloud Native'],
    description: 'Automated container deployment, scaling, and operational management system.'
  },
  {
    canonical: 'AWS',
    category: 'DevOps & Cloud',
    synonyms: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'aws cloud'],
    related: ['Cloud Computing', 'Terraform', 'Serverless'],
    description: 'Comprehensive cloud computing platform provided by Amazon.'
  },
  {
    canonical: 'Google Cloud (GCP)',
    category: 'DevOps & Cloud',
    synonyms: ['gcp', 'google cloud', 'google cloud platform', 'gke', 'cloud run'],
    related: ['AWS', 'Kubernetes', 'Cloud Computing'],
    description: 'Suite of cloud computing services by Google on Google infrastructure.'
  },
  {
    canonical: 'Microsoft Azure',
    category: 'DevOps & Cloud',
    synonyms: ['azure', 'microsoft azure', 'azure devops'],
    related: ['Cloud Computing', 'C#', '.NET'],
    description: 'Cloud computing platform operated by Microsoft.'
  },
  {
    canonical: 'CI/CD',
    category: 'DevOps & Cloud',
    synonyms: [
      'ci/cd', 'ci cd', 'continuous integration', 'continuous deployment', 'continuous delivery',
      'github actions', 'gitlab ci', 'jenkins', 'circleci', 'pipelines'
    ],
    related: ['DevOps', 'Automated Testing', 'Docker'],
    description: 'Automated pipeline practices that automate building, testing, and deploying code.'
  },
  {
    canonical: 'Terraform',
    category: 'DevOps & Cloud',
    synonyms: ['terraform', 'iac', 'infrastructure as code'],
    related: ['AWS', 'DevOps', 'Cloud Architecture'],
    description: 'Infrastructure as code tool that lets you build, change, and version resources safely.'
  },
  {
    canonical: 'Linux',
    category: 'DevOps & Cloud',
    synonyms: ['linux', 'unix', 'ubuntu', 'centos', 'debian', 'bash', 'shell scripting', 'posix'],
    related: ['DevOps', 'System Administration'],
    description: 'Unix-like operating system foundation for server infrastructures.'
  },
  {
    canonical: 'Git',
    category: 'DevOps & Cloud',
    synonyms: ['git', 'github', 'gitlab', 'version control', 'vcs', 'bitbucket'],
    related: ['Software Development', 'Collaboration'],
    description: 'Distributed version control system for tracking source code changes.'
  },

  // Architecture & Methodologies
  {
    canonical: 'Microservices',
    category: 'Architecture & Methodologies',
    synonyms: ['microservices', 'microservice architecture', 'distributed systems', 'service oriented'],
    related: ['Docker', 'REST APIs', 'gRPC', 'Kubernetes'],
    description: 'Architectural style that structures an application as a collection of loose services.'
  },
  {
    canonical: 'Agile/Scrum',
    category: 'Architecture & Methodologies',
    synonyms: ['agile', 'scrum', 'kanban', 'sprint planning', 'jira', 'agile methodologies'],
    related: ['Project Management', 'Collaboration'],
    description: 'Iterative approach to project management and software development.'
  },
  {
    canonical: 'System Design',
    category: 'Architecture & Methodologies',
    synonyms: ['system design', 'distributed architecture', 'scalability', 'high availability', 'load balancing'],
    related: ['Microservices', 'Database Design', 'Cloud Architecture'],
    description: 'Process of defining architecture, interfaces, and data for a system to satisfy requirements.'
  },

  // Testing & Quality Assurance
  {
    canonical: 'Unit Testing',
    category: 'Testing & QA',
    synonyms: ['unit testing', 'unit tests', 'tdd', 'test driven development', 'jest', 'mocha', 'pytest', 'junit'],
    related: ['Automated Testing', 'Integration Testing', 'Code Quality'],
    description: 'Method by which individual units of source code are tested for correctness.'
  },
  {
    canonical: 'Integration Testing',
    category: 'Testing & QA',
    synonyms: ['integration testing', 'integration tests', 'e2e', 'end to end testing', 'cypress', 'selenium', 'playwright'],
    related: ['Unit Testing', 'QA Automation'],
    description: 'Phase in software testing in which individual software modules are combined and tested as a group.'
  },

  // Data, AI & Machine Learning
  {
    canonical: 'Machine Learning',
    category: 'Data & AI',
    synonyms: ['machine learning', 'ml', 'deep learning', 'ai', 'artificial intelligence', 'neural networks'],
    related: ['Python', 'TensorFlow', 'PyTorch', 'Data Science'],
    description: 'Field of inquiry devoted to understanding and building methods that learn from data.'
  },
  {
    canonical: 'Data Analysis',
    category: 'Data & AI',
    synonyms: ['data analysis', 'data analytics', 'pandas', 'numpy', 'data visualization'],
    related: ['Python', 'SQL', 'Business Intelligence'],
    description: 'Process of inspecting, cleansing, transforming, and modeling data.'
  },

  // Soft Skills
  {
    canonical: 'Problem Solving',
    category: 'Soft Skills',
    synonyms: ['problem solving', 'troubleshooting', 'analytical thinking', 'critical thinking', 'debugging'],
    related: ['Engineering Mindset', 'Communication'],
    description: 'Ability to identify problems, brainstorm and analyze answers, and implement solutions.'
  },
  {
    canonical: 'Communication',
    category: 'Soft Skills',
    synonyms: ['communication', 'verbal communication', 'written communication', 'presentation skills', 'interpersonal skills'],
    related: ['Teamwork', 'Collaboration'],
    description: 'Clear exchange of information and technical concepts between team members.'
  },
  {
    canonical: 'Teamwork & Collaboration',
    category: 'Soft Skills',
    synonyms: ['teamwork', 'collaboration', 'cross-functional collaboration', 'team player', 'pair programming'],
    related: ['Agile/Scrum', 'Communication'],
    description: 'Cooperative effort by members of a group to achieve a common software goal.'
  },
  {
    canonical: 'Leadership & Mentorship',
    category: 'Soft Skills',
    synonyms: ['leadership', 'mentorship', 'coaching', 'tech lead', 'guiding junior engineers'],
    related: ['Communication', 'Teamwork'],
    description: 'Guiding, inspiring, and empowering team members toward technical excellence.'
  },
  {
    canonical: 'Adaptability',
    category: 'Soft Skills',
    synonyms: ['adaptability', 'fast learner', 'quick learner', 'flexibility', 'continuous learning'],
    related: ['Problem Solving'],
    description: 'Capacity to adjust quickly to new technologies and evolving requirements.'
  }
];

// Build inverted fast lookup map: normalized_alias -> canonical_object
const SYNONYM_LOOKUP_MAP = new Map();

for (const entry of SKILL_DATABASE) {
  // Map canonical itself
  SYNONYM_LOOKUP_MAP.set(entry.canonical.toLowerCase(), entry);

  // Map each alias
  for (const synonym of entry.synonyms) {
    SYNONYM_LOOKUP_MAP.set(synonym.toLowerCase().trim(), entry);
  }
}

/**
 * Resolves any skill variation or alias into its Canonical entry.
 * Returns null if not found in dictionary.
 */
function resolveSkillSynonym(rawSkill) {
  if (!rawSkill || typeof rawSkill !== 'string') return null;
  const cleaned = rawSkill.toLowerCase().trim().replace(/^[•\-\*\s]+/, '');
  return SYNONYM_LOOKUP_MAP.get(cleaned) || null;
}

/**
 * Returns canonical name for a given skill phrase or the cleaned rawSkill if unknown.
 */
function getCanonicalSkillName(rawSkill) {
  const match = resolveSkillSynonym(rawSkill);
  return match ? match.canonical : rawSkill.trim();
}

/**
 * Checks if two skill expressions refer to the exact same canonical skill.
 * Example: isSkillEquivalent('ReactJS', 'React.js') === true
 */
function isSkillEquivalent(skillA, skillB) {
  if (!skillA || !skillB) return false;
  const canonA = getCanonicalSkillName(skillA).toLowerCase();
  const canonB = getCanonicalSkillName(skillB).toLowerCase();
  return canonA === canonB;
}

module.exports = {
  SKILL_DATABASE,
  SYNONYM_LOOKUP_MAP,
  resolveSkillSynonym,
  getCanonicalSkillName,
  isSkillEquivalent,
};
