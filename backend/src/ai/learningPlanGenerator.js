/**
 * Two-Week (14-Day) Personalized Learning Planner
 * 
 * Prioritizes the candidate's top 3 missing skills from the Job Description
 * and constructs an intensive, actionable day-by-day curriculum complete with
 * verified free learning resources and mini-projects.
 */

// Skill curriculum templates for rich technical domains
const CURRICULUM_TEMPLATES = {
  "Docker": [
    {
      topic: "Containers vs Virtual Machines & Docker CLI Core",
      learningObjective: "Understand container virtualization, Linux namespaces, and master core CLI commands (docker run, exec, ps, logs, rm).",
      practicalTask: "Run a detached Nginx container with port mapping 8080:80, inspect container metadata with docker inspect, and modify the HTML root via volume bind mount.",
      estimatedTime: "2 hours",
      resources: [
        { title: "Docker Official Getting Started Guide", url: "https://docs.docker.com/get-started/" },
        { title: "freeCodeCamp Docker Handbook", url: "https://www.freecodecamp.org/news/the-docker-handbook/" }
      ],
      miniProject: "Spin up a local static portfolio site inside an alpine-nginx container."
    },
    {
      topic: "Dockerfile Authoring & Layer Caching",
      learningObjective: "Write production Dockerfiles using optimal layer ordering, minimal base images (Alpine), and proper ENV/WORKDIR declarations.",
      practicalTask: "Containerize an existing Node.js or Python backend application, ensuring package.json is copied before source code to exploit Docker layer caching.",
      estimatedTime: "2 hours",
      resources: [
        { title: "Dockerfile Best Practices Guide", url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/" }
      ],
      miniProject: "Build an optimized Node.js Docker image under 150MB with a non-root USER."
    },
    {
      topic: "Multi-Stage Builds & Image Size Optimization",
      learningObjective: "Separate build dependencies from production runtime to shrink attack surface and image size by up to 80%.",
      practicalTask: "Create a multi-stage Dockerfile for a React/Vite frontend: Stage 1 builds static assets; Stage 2 serves assets with Nginx Alpine.",
      estimatedTime: "2.5 hours",
      resources: [
        { title: "Multi-Stage Build Documentation", url: "https://docs.docker.com/build/building/multi-stage/" }
      ],
      miniProject: "Ship a 25MB production image from a 1GB TypeScript/React build."
    },
    {
      topic: "Multi-Container Orchestration with Docker Compose",
      learningObjective: "Define multi-tier services, isolated bridge networks, environment variables, and persistent data volumes using docker-compose.yml.",
      practicalTask: "Create a compose file connecting an Express API with MongoDB, configuring health checks, depends_on conditions, and persistent volume mounts.",
      estimatedTime: "2.5 hours",
      resources: [
        { title: "Docker Compose Specification", url: "https://docs.docker.com/compose/" }
      ],
      miniProject: "Orchestrate an API, database, and Redis cache with single-command startup (docker compose up)."
    },
    {
      topic: "Production Container Hardening & Container Registries",
      learningObjective: "Apply security scanning (docker scout/trivy), manage secrets securely, and push version-tagged images to Docker Hub or GHCR.",
      practicalTask: "Scan your container for CVE vulnerabilities, replace root user execution, and configure a GitHub Action to publish image on push.",
      estimatedTime: "2 hours",
      resources: [
        { title: "OWASP Docker Security Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html" }
      ],
      miniProject: "Publish a zero-vulnerability container to GitHub Container Registry."
    }
  ],

  "Kubernetes": [
    {
      topic: "K8s Architecture, Pods & Minikube/Kind Setup",
      learningObjective: "Understand Control Plane components (API Server, etcd, scheduler) vs Worker Nodes (kubelet, kube-proxy, runtime).",
      practicalTask: "Install Minikube or Kind locally, launch a single-pod specification, and inspect pod events with kubectl describe.",
      estimatedTime: "2.5 hours",
      resources: [
        { title: "Kubernetes Official Tutorials", url: "https://kubernetes.io/docs/tutorials/" }
      ],
      miniProject: "Deploy and interact with a multi-container Pod sharing an emptyDir volume."
    },
    {
      topic: "Deployments, ReplicaSets & Rolling Updates",
      learningObjective: "Manage declarative application lifecycles, zero-downtime rolling updates, and rollbacks.",
      practicalTask: "Author a Deployment YAML with 3 replicas, update image tag to trigger rolling deployment, and practice kubectl rollout undo.",
      estimatedTime: "2 hours",
      resources: [
        { title: "Kubernetes Deployments Deep-Dive", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" }
      ],
      miniProject: "Simulate a live zero-downtime version upgrade with zero dropped requests."
    },
    {
      topic: "Services (ClusterIP, NodePort, LoadBalancer) & Ingress",
      learningObjective: "Expose pods internally and externally using K8s Services and Ingress controllers with DNS routing.",
      practicalTask: "Create a ClusterIP service for your backend API and an Ingress route routing /api to backend and / to frontend.",
      estimatedTime: "2.5 hours",
      resources: [
        { title: "Kubernetes Service Concepts", url: "https://kubernetes.io/docs/concepts/services-networking/service/" }
      ],
      miniProject: "Configure host-based routing via Nginx Ingress Controller on your local cluster."
    },
    {
      topic: "ConfigMaps, Secrets & Persistent Volumes (PVC)",
      learningObjective: "Decouple configuration from container images and mount persistent network storage for databases.",
      practicalTask: "Create a Secret for DB passwords, inject it via envFrom, and bind a PersistentVolumeClaim to a PostgreSQL pod.",
      estimatedTime: "2 hours",
      resources: [
        { title: "Kubernetes Storage & Secrets", url: "https://kubernetes.io/docs/concepts/configuration/secret/" }
      ],
      miniProject: "Deploy a resilient stateful database pod whose data survives pod termination."
    },
    {
      topic: "Helm Package Management & Cluster Health Probes",
      learningObjective: "Package cloud-native applications with Helm charts and configure liveness/readiness probes.",
      practicalTask: "Write a Helm chart with values.yaml templating, configure HTTP readiness probes, and deploy in one command.",
      estimatedTime: "2 hours",
      resources: [
        { title: "Helm Documentation", url: "https://helm.sh/docs/intro/quickstart/" }
      ],
      miniProject: "Create a reusable Helm chart for any Node/Express microservice."
    }
  ],

  "PostgreSQL": [
    {
      topic: "Relational Schema Design & ACID Transactions",
      learningObjective: "Design 3NF normalized tables with foreign keys, constraints, and execute atomic multi-table transactions (BEGIN...COMMIT).",
      practicalTask: "Create an e-commerce schema (Users, Orders, Items) with proper ON DELETE CASCADE rules and check constraints.",
      estimatedTime: "2 hours",
      resources: [
        { title: "PostgreSQL Official Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }
      ],
      miniProject: "Implement a balance transfer script with atomic transactions and rollback on failure."
    },
    {
      topic: "Complex Queries, JOINs, Aggregations & Window Functions",
      learningObjective: "Master INNER/LEFT/FULL JOINs, GROUP BY HAVING, and window functions (ROW_NUMBER(), RANK(), LAG()).",
      practicalTask: "Write a query calculating month-over-month revenue growth using window functions on order tables.",
      estimatedTime: "2.5 hours",
      resources: [
        { title: "PostgreSQL Window Functions Tutorial", url: "https://www.postgresqltutorial.com/postgresql-window-function/" }
      ],
      miniProject: "Build an analytical reporting query calculating top-spending users per category."
    },
    {
      topic: "Indexing Strategies (B-Tree, GIN) & EXPLAIN ANALYZE",
      learningObjective: "Analyze query execution plans, identify sequential scans, and design composite/GIN indexes to boost query speed.",
      practicalTask: "Generate 100,000 mock rows, run EXPLAIN ANALYZE on a filter query, add a targeted index, and compare execution cost reduction.",
      estimatedTime: "2 hours",
      resources: [
        { title: "Use The Index, Luke! (SQL Indexing Guide)", url: "https://use-the-index-luke.com/" }
      ],
      miniProject: "Optimize a slow query from 850ms to under 4ms using partial indexes."
    },
    {
      topic: "JSONB Semi-Structured Data & Full-Text Search",
      learningObjective: "Store and query unstructured document data inside Postgres with JSONB operators and tsvector search.",
      practicalTask: "Create a product table with JSONB attributes, query with ->> and ?, and implement a typo-tolerant text search index.",
      estimatedTime: "2 hours",
      resources: [
        { title: "Postgres JSON Types", url: "https://www.postgresql.org/docs/current/datatype-json.html" }
      ],
      miniProject: "Build a full-text search engine across blog posts with ranking and highlighting."
    },
    {
      topic: "Connection Pooling (PgBouncer) & Node.js Integration",
      learningObjective: "Connect Node.js backends using node-postgres (pg) and configure connection pools to handle concurrency.",
      practicalTask: "Build an Express API endpoint connected to a pooled Postgres client with parameterization to prevent SQL injection.",
      estimatedTime: "2 hours",
      resources: [
        { title: "node-postgres Documentation", url: "https://node-postgres.com/" }
      ],
      miniProject: "Build a high-throughput REST API with safe parameterized queries."
    }
  ],

  "AWS": [
    {
      topic: "IAM Roles, Policies & Cloud Security Foundations",
      learningObjective: "Master the Principle of Least Privilege, IAM users, groups, custom JSON policies, and IAM roles for EC2/Lambda.",
      practicalTask: "Create an IAM role allowing read-only access to a specific S3 bucket, and test access via AWS CLI with assumed role.",
      estimatedTime: "2 hours",
      resources: [
        { title: "AWS IAM Best Practices", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" }
      ],
      miniProject: "Set up fine-grained permission policy for a production deployment pipeline."
    },
    {
      topic: "S3 Object Storage, Static Hosting & Pre-signed URLs",
      learningObjective: "Configure S3 buckets, CORS headers, lifecycle policies, and secure direct client uploads via pre-signed URLs.",
      practicalTask: "Write a Node.js function that generates a 15-minute temporary pre-signed PUT URL for secure resume uploads.",
      estimatedTime: "2 hours",
      resources: [
        { title: "AWS S3 Developer Guide", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" }
      ],
      miniProject: "Build a direct-to-S3 secure file upload service without routing file bytes through your web server."
    },
    {
      topic: "Compute with AWS Lambda & API Gateway (Serverless)",
      learningObjective: "Deploy serverless Node.js functions triggered by HTTP requests through AWS API Gateway.",
      practicalTask: "Build an image resizer Lambda triggered by S3 file upload events, writing processed thumbnails to an output bucket.",
      estimatedTime: "2.5 hours",
      resources: [
        { title: "AWS Serverless Application Model (SAM)", url: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html" }
      ],
      miniProject: "Deploy a serverless REST endpoint connected to DynamoDB."
    },
    {
      topic: "VPC, Subnets, Security Groups & RDS",
      learningObjective: "Understand cloud network architecture: Public vs Private Subnets, Route Tables, NAT Gateways, and isolated database instances.",
      practicalTask: "Design a VPC with an isolated private subnet hosting an RDS Postgres instance accessible only by your web servers.",
      estimatedTime: "2.5 hours",
      resources: [
        { title: "AWS VPC Architecture Guide", url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html" }
      ],
      miniProject: "Provision a secure two-tier cloud network diagram."
    },
    {
      topic: "Monitoring with CloudWatch & Infrastructure Automation",
      learningObjective: "Collect log streams, configure metric alarms (CPU/5XX errors), and write AWS CloudFormation or CDK scripts.",
      practicalTask: "Configure a CloudWatch alert that triggers an SNS email notification when HTTP 500 error rates exceed 1%.",
      estimatedTime: "2 hours",
      resources: [
        { title: "AWS CloudWatch User Guide", url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html" }
      ],
      miniProject: "Set up automated anomaly detection alarms for an active API."
    }
  ],

  "CI/CD": [
    {
      topic: "GitHub Actions Core: Workflows, Jobs & Steps",
      learningObjective: "Write .github/workflows YAML definitions with environment matrix, secrets, and artifact caching.",
      practicalTask: "Create an action that triggers on pull requests to run linting, TypeScript type-checking, and unit tests.",
      estimatedTime: "2 hours",
      resources: [
        { title: "GitHub Actions Quickstart", url: "https://docs.github.com/en/actions/quickstart" }
      ],
      miniProject: "Build a PR gatekeeper workflow that blocks merges on failing tests or lint errors."
    },
    {
      topic: "Automated Testing & Coverage Reporting in Pipeline",
      learningObjective: "Integrate Jest/Vitest automated tests, generate coverage badges, and fail build if coverage drops below 80%.",
      practicalTask: "Run test suites across Node 18, 20, and 22 in parallel matrix, publishing test reports as workflow artifacts.",
      estimatedTime: "2 hours",
      resources: [
        { title: "Building and Testing Node.js Workflows", url: "https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs" }
      ],
      miniProject: "Set up automated coverage comment on every GitHub Pull Request."
    },
    {
      topic: "Automated Docker Build, Tagging & Registry Push",
      learningObjective: "Use Docker Buildx, layer cache backends, and semantic versioning (SemVer) to push tags automatically.",
      practicalTask: "Write a workflow that logs into Docker Hub with encrypted secrets, builds image, and pushes tags based on Git release tags.",
      estimatedTime: "2 hours",
      resources: [
        { title: "Docker Build Push Action", url: "https://github.com/marketplace/actions/build-and-push-docker-images" }
      ],
      miniProject: "Build an automated release-to-production Docker image deployment pipeline."
    }
  ]
};

// Generic module generator for any skill in the taxonomy
function generateGenericModule(skillName, dayNum, stage) {
  const meta = {
    1: {
      topic: `${skillName} Core Concepts & Architecture`,
      learningObjective: `Understand the foundational philosophy, architecture, and primary mental models behind ${skillName}.`,
      practicalTask: `Set up a clean developer workspace for ${skillName}, review official getting-started documentation, and run a baseline demo.`,
      estimatedTime: "1.5 hours",
      miniProject: `Build a "Hello World" proof-of-concept demonstrating basic operations in ${skillName}.`
    },
    2: {
      topic: `${skillName} Practical Fundamentals & Common Patterns`,
      learningObjective: `Master core APIs, configuration parameters, and idiomatic coding patterns in ${skillName}.`,
      practicalTask: `Implement the top 3 most common operations or architectural patterns required in modern production codebases.`,
      estimatedTime: "2 hours",
      miniProject: `Construct a functional component or service utilizing core ${skillName} capabilities.`
    },
    3: {
      topic: `${skillName} Real-World Integration & Data Flow`,
      learningObjective: `Connect ${skillName} with external services (APIs, databases, client interfaces) and handle errors gracefully.`,
      practicalTask: `Integrate ${skillName} into an Express backend or React frontend, validating inputs and writing structured logs.`,
      estimatedTime: "2 hours",
      miniProject: `Build a resilient data processing pipeline incorporating ${skillName}.`
    },
    4: {
      topic: `${skillName} Performance, Security & Production Best Practices`,
      learningObjective: `Identify common bottlenecks, security antipatterns, and implement optimization techniques.`,
      practicalTask: `Conduct a code audit on your implementation, benchmark execution times, and harden security configurations.`,
      estimatedTime: "2 hours",
      miniProject: `Refactor code to meet enterprise production standards with caching or optimizations.`
    },
    5: {
      topic: `${skillName} Testing, Debugging & Portfolio Project Integration`,
      learningObjective: `Write unit and integration tests verifying ${skillName} behavior under edge cases and error scenarios.`,
      practicalTask: `Author automated test assertions and document the architecture in a clean README.`,
      estimatedTime: "2 hours",
      miniProject: `Complete a self-contained GitHub repository showcasing ${skillName} mastery for your resume.`
    }
  };

  const selected = meta[stage] || meta[1];
  return {
    ...selected,
    resources: [
      { title: `${skillName} Official Documentation`, url: `https://duckduckgo.com/?q=${encodeURIComponent(skillName + ' official documentation tutorial')}` },
      { title: `Roadmap.sh ${skillName} Guide`, url: `https://roadmap.sh` },
      { title: `freeCodeCamp ${skillName} Guide`, url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skillName)}` }
    ]
  };
}

/**
 * Generate 14-day Structured Learning Plan
 */
function generateTwoWeekLearningPlan(missingSkills) {
  if (!missingSkills || missingSkills.length === 0) {
    return {
      targetSkills: [],
      days: [],
      summary: "No significant skill gaps were detected! Focus on interview practice and system design."
    };
  }

  // Prioritize top 3 missing skills: Required first, then by importance weight
  const sortedMissing = [...missingSkills].sort((a, b) => {
    if (a.priority === 'required' && b.priority !== 'required') return -1;
    if (a.priority !== 'required' && b.priority === 'required') return 1;
    return (b.importanceWeight || 0.8) - (a.importanceWeight || 0.8);
  });

  const top3Skills = sortedMissing.slice(0, 3);
  const skill1 = top3Skills[0]?.canonicalName || "System Design";
  const skill2 = top3Skills[1]?.canonicalName || (top3Skills[0] ? "Automated Testing" : "CI/CD");
  const skill3 = top3Skills[2]?.canonicalName || (top3Skills[1] ? "Docker" : "REST API");

  const days = [];

  // Days 1-5: Deep dive into Skill 1 (Highest Priority)
  for (let d = 1; d <= 5; d++) {
    const templateList = CURRICULUM_TEMPLATES[skill1];
    const moduleData = (templateList && templateList[d - 1])
      ? templateList[d - 1]
      : generateGenericModule(skill1, d, d);

    days.push({
      day: d,
      skill: skill1,
      priority: 'CRITICAL',
      phase: 'Primary Gap Mastery',
      ...moduleData,
      completed: false
    });
  }

  // Days 6-10: Deep dive into Skill 2 (Secondary Priority)
  for (let d = 6; d <= 10; d++) {
    const stage = d - 5;
    const templateList = CURRICULUM_TEMPLATES[skill2];
    const moduleData = (templateList && templateList[stage - 1])
      ? templateList[stage - 1]
      : generateGenericModule(skill2, d, stage);

    days.push({
      day: d,
      skill: skill2,
      priority: 'HIGH',
      phase: 'Secondary Gap Mastery',
      ...moduleData,
      completed: false
    });
  }

  // Days 11-13: Rapid adoption of Skill 3
  for (let d = 11; d <= 13; d++) {
    const stage = d - 10;
    const templateList = CURRICULUM_TEMPLATES[skill3];
    const moduleData = (templateList && templateList[stage - 1])
      ? templateList[stage - 1]
      : generateGenericModule(skill3, d, stage);

    days.push({
      day: d,
      skill: skill3,
      priority: 'ESSENTIAL',
      phase: 'Supporting Gap Mastery',
      ...moduleData,
      completed: false
    });
  }

  // Day 14: Capstone Integration Project bridging all 3 missing skills
  days.push({
    day: 14,
    skill: `${skill1} + ${skill2} + ${skill3}`,
    priority: 'CAPSTONE',
    phase: 'Full-Stack Portfolio Integration',
    topic: `Production Capstone: Integrating ${skill1}, ${skill2}, and ${skill3}`,
    learningObjective: `Synthesize all three acquired competencies into a tangible, deployable, open-source portfolio project that directly addresses the target Job Description.`,
    practicalTask: `Build and deploy an end-to-end repository that connects ${skill1}, ${skill2}, and ${skill3}. Document the architectural design in a clean README with architecture diagram, test commands, and live demo link. Add this project as a bullet point to your updated resume!`,
    estimatedTime: "3.5 hours",
    resources: [
      { title: "Building an Impressive Tech Portfolio", url: "https://www.freecodecamp.org/news/how-to-build-a-developer-portfolio/" },
      { title: "GitHub README Template Guide", url: "https://github.com/othneildrew/Best-README-Template" }
    ],
    miniProject: `Publish repository to GitHub, configure CI/CD actions, and update your resume with a concrete quantifiable bullet point.`,
    completed: false
  });

  return {
    targetSkills: [skill1, skill2, skill3],
    days,
    summary: `Structured 14-day sprint prioritizing ${skill1}, ${skill2}, and ${skill3}. Follow the day-by-day tasks to eliminate your critical job gaps.`
  };
}

module.exports = {
  generateTwoWeekLearningPlan
};
