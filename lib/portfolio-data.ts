// ─── Central portfolio data for Sanskar Phougat ───
// Edit this file to update content across the entire site.

// ────────────────────────────── Profile ──────────────────────────────

export const profile = {
  name: 'Sanskar Phougat',
  handle: '@sanskarphougat',
  role: 'Software Engineer — Backend & Secure Systems',
  tagline: "I build things that work, then make sure they can't be broken.",
  location: 'Noida, India',
  available: true,
  status: 'Open to SDE roles (graduating 2027)',
  bio: "I'm a final-year Electronics and Communication Engineering student at JIIT Noida who prefers building software to reading about it. I work mostly on backend systems, with a strong interest in security: I design APIs, databases and deployment pipelines, and I treat encryption, access control and testing as part of the design from day one. My main project, MedVault, is a zero-trust medical records platform where the server only ever stores ciphertext. I also build browser extensions, run a public daily learning log, and teach workshops on cryptography, Python/Git and networking at my college. I'm looking for an SDE role where I can keep building reliable, secure software.",
  links: {
    github: 'https://github.com/Sanskar-bot',
    linkedin: 'https://www.linkedin.com/in/sanskar-phougat',
    tryhackme: 'https://tryhackme.com/p/Sanskar2003',
    leetcode: 'https://leetcode.com/u/Sanskar_phougat/',
    resume: '/resume.pdf',
    email: 'mailto:sanskarphougat2004@gmail.com',
  },
};

// ────────────────────────────── Education ──────────────────────────────

export type Education = {
  degree: string;
  institution: string;
  date: string;
  coursework: string[];
};

export const education: Education = {
  degree: 'B.Tech, Electronics and Communication Engineering',
  institution: 'Jaypee Institute of Information Technology (JIIT), Noida',
  date: 'Aug 2023 – Jun 2027 (expected)',
  coursework: [
    'Data Structures & Algorithms',
    'Object-Oriented Programming',
    'Operating Systems',
    'DBMS',
    'Computer Networks',
    'Telecom Systems (OFDM, CDMA capacity, power delay profiles)',
    'Verilog & VHDL',
    'VLSI Design',
  ],
};

// ────────────────────────────── Experience ──────────────────────────────

export type ExperienceItem = {
  title: string;
  org: string;
  date: string;
  bullets: string[];
};

export const experience: ExperienceItem[] = [
  {
    title: 'Research Intern',
    org: 'CyberPeace Foundation (Research Wing), New Delhi',
    date: '2026',
    bullets: [
      'Wrote cybersecurity research and awareness material: a fundamentals presentation (NIST, ISO/IEC 27001, CERT-In frameworks), a case study of the 2022 AIIMS Delhi ransomware attack, and a presentation on the OSI model and network protocols.',
      'Researched the growing threat to medical data, which shaped the design of MedVault.',
      'Built a password strength analyzer browser extension (PassGuard) and an AI news fact-checking extension (Clarifact).',
      'Designed, secured and deployed MedVault, a zero-trust medical records platform, working with the Research Wing mentor.',
      'Documented my learning daily in a public GitHub log (Daily-Learnings).',
    ],
  },
];

// ────────────────────────────── Journey / Timeline ──────────────────────────────

export type JourneyItem = {
  title: string;
  org: string;
  date: string;
  description: string;
  placeholder: boolean;
};

export const journey: JourneyItem[] = [
  {
    title: 'Started B.Tech at JIIT Noida',
    org: 'Jaypee Institute of Information Technology',
    date: '2023',
    description:
      'Started my Electronics and Communication Engineering journey at JIIT Noida. Began exploring programming, computer science fundamentals, and the intersection of hardware and software.',
    placeholder: false,
  },
  {
    title: 'Technical Head — AI Tronics Society',
    org: 'JIIT Noida',
    date: 'Aug 2023 – Present',
    description:
      'Took on technical leadership responsibilities at the AI Tronics Society. Organised workshops, taught Applied Cryptography, Python/Git, and networking sessions, and helped build a collaborative environment around technology and innovation.',
    placeholder: false,
  },
  {
    title: 'Exploring Cybersecurity',
    org: 'Self-directed Learning',
    date: '2024 – 2025',
    description:
      'My interest expanded towards cybersecurity, networking, cryptography, and secure system design. Started exploring how vulnerabilities emerge, how systems are attacked, and how security can be integrated into software architecture from the ground up.',
    placeholder: false,
  },
  {
    title: 'Software Engineering Internship',
    org: 'CyberPeace Foundation (Research Wing), New Delhi',
    date: '2026',
    description:
      'Gained practical industry exposure working with real-world development workflows. Collaborated on cybersecurity research, built production tools, and strengthened my understanding of secure software engineering practices.',
    placeholder: false,
  },
  {
    title: 'Building, Learning & Exploring',
    org: 'Current Focus',
    date: '2026 – Present',
    description:
      'Continuing to develop backend engineering skills, deepen my understanding of security, explore AI-powered applications, and build reliable software systems while preparing for software engineering opportunities.',
    placeholder: false,
  },
];

// ────────────────────────────── Tech Stack (3 tiers) ──────────────────────────────

export type TechItem = {
  name: string;
  blurb: string;
  metric: string | null;
  metricLabel: string | null;
};

export type TechCategory = {
  index: string;
  label: string;
  items: TechItem[];
};

export const techCategories: TechCategory[] = [
  {
    index: '#01',
    label: 'Languages',
    items: [
      { name: 'Python', blurb: 'Backend, scripting, automation, security tooling', metric: null, metricLabel: null },
      { name: 'Java', blurb: 'Spring Boot APIs, OOP, data structures', metric: null, metricLabel: null },
      { name: 'JavaScript', blurb: 'Full-stack web development, Node.js', metric: null, metricLabel: null },
      { name: 'TypeScript', blurb: 'Type-safe frontend and backend', metric: null, metricLabel: null },
      { name: 'SQL', blurb: 'Schema design, indexing, query optimisation', metric: null, metricLabel: null },
    ],
  },
  {
    index: '#02',
    label: 'Backend & Frameworks',
    items: [
      { name: 'Flask', blurb: 'Python REST APIs, MedVault backend', metric: null, metricLabel: null },
      { name: 'Spring Boot', blurb: 'Java REST APIs, modular service layers', metric: null, metricLabel: null },
      { name: 'Node.js / Express', blurb: 'Server-side JS, Clarifact backend', metric: null, metricLabel: null },
      { name: 'React', blurb: 'Component-based UI development', metric: null, metricLabel: null },
      { name: 'Next.js', blurb: 'Full-stack React framework', metric: null, metricLabel: null },
      { name: 'Tailwind CSS', blurb: 'Utility-first styling', metric: null, metricLabel: null },
    ],
  },
  {
    index: '#03',
    label: 'Databases & DevOps',
    items: [
      { name: 'PostgreSQL', blurb: 'Primary relational DB, indexing, connection pooling', metric: null, metricLabel: null },
      { name: 'MongoDB', blurb: 'Document store for flexible schemas', metric: null, metricLabel: null },
      { name: 'MySQL', blurb: 'Schema design and query optimisation', metric: null, metricLabel: null },
      { name: 'Docker', blurb: 'Containerised deployments', metric: null, metricLabel: null },
      { name: 'Git & GitHub', blurb: 'Version control, code review, collaboration', metric: null, metricLabel: null },
      { name: 'GitHub Actions', blurb: 'CI/CD pipelines, automated testing', metric: null, metricLabel: null },
      { name: 'AWS', blurb: 'EC2, Route 53, Bedrock', metric: null, metricLabel: null },
    ],
  },
  {
    index: '#04',
    label: 'Security & Testing',
    items: [
      { name: 'Applied Cryptography', blurb: 'RSA, AES-GCM, Argon2id — shipped in production', metric: null, metricLabel: null },
      { name: 'Secure Coding', blurb: 'Access control, input validation, vulnerability remediation', metric: null, metricLabel: null },
      { name: 'pytest', blurb: 'Unit and integration tests, systematic debugging', metric: null, metricLabel: null },
      { name: 'Wireshark', blurb: 'Network traffic analysis', metric: null, metricLabel: null },
      { name: 'Burp Suite', blurb: 'Web vulnerability analysis', metric: null, metricLabel: null },
      { name: 'mitmproxy', blurb: 'Man-in-the-middle interception and testing', metric: null, metricLabel: null },
      { name: 'Linux (Kali) & Bash', blurb: 'System administration, scripting, pen-testing', metric: null, metricLabel: null },
    ],
  },
  {
    index: '#05',
    label: 'Working Knowledge',
    items: [
      { name: 'C / C++', blurb: 'Systems programming, algorithms', metric: null, metricLabel: null },
      { name: 'GraphQL', blurb: 'API layer on top of REST (VaultZero)', metric: null, metricLabel: null },
      { name: 'FastAPI', blurb: 'High-performance Python APIs (PhishingCheck4U)', metric: null, metricLabel: null },
      { name: 'Apache Kafka', blurb: 'Real-time data pipelines (project level)', metric: null, metricLabel: null },
      { name: 'TensorFlow & OpenCV', blurb: 'Image classification (one project)', metric: null, metricLabel: null },
      { name: 'LLM Integration', blurb: 'Prompt iteration, model integration (Clarifact)', metric: null, metricLabel: null },
      { name: 'TCP/IP & Packet Tracer', blurb: 'Networking fundamentals, Cisco labs', metric: null, metricLabel: null },
      { name: 'OWASP Top 10', blurb: 'Web application security risks', metric: null, metricLabel: null },
    ],
  },
  {
    index: '#06',
    label: 'Familiar / Learning',
    items: [
      { name: 'AWS S3 / RDS / Lambda', blurb: 'Cloud storage, managed DB, serverless', metric: null, metricLabel: null },
      { name: 'RAG & LangChain', blurb: 'Concepts only — not shipped', metric: null, metricLabel: null },
      { name: 'Angular', blurb: 'Tutorial level', metric: null, metricLabel: null },
      { name: 'Kotlin / Swift / Flutter', blurb: 'Tutorial level', metric: null, metricLabel: null },
      { name: 'Pandas & PySpark', blurb: 'Studied, not shipped', metric: null, metricLabel: null },
      { name: 'Embedded C & Verilog/VHDL', blurb: 'Coursework projects', metric: null, metricLabel: null },
    ],
  },
];

// ────────────────────────────── Featured Projects ──────────────────────────────

export type Project = {
  name: string;
  catchphrase: string;
  description: string;
  tags: string[];
  ticketNo: string;
  screenshot: string | null;
  link: string | null;
  liveUrl?: string | null;
};

export const projects: Project[] = [
  {
    name: 'MedVault',
    catchphrase: 'Your health data, your keys, your control.',
    description:
      'A zero-trust medical records platform with hybrid encryption (AES-256-GCM + RSA-4096 OAEP). Patients hold the keys; doctors get time-limited access only with consent. 25 security issues found and fixed, 40+ automated tests, deployed on AWS with CI/CD.',
    tags: ['Python', 'Flask', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'pytest'],
    ticketNo: 'SP-01 / 07',
    screenshot: null,
    link: 'https://github.com/Sanskar-bot/medical-data-decentralisation',
    liveUrl: null,
  },
  {
    name: 'Clarifact',
    catchphrase: 'Select any text. Get the truth.',
    description:
      'AI fact-checking Chrome extension. Select text on any webpage and get a verdict (Supported, Inconclusive, or Contradicted) with sources. Backend searches the web, scores sources with NLP, and asks the model. Refined across 1,000+ test cases.',
    tags: ['Node.js', 'Express', 'Chrome Extension', 'AWS Bedrock', 'Render'],
    ticketNo: 'SP-02 / 07',
    screenshot: null,
    link: 'https://github.com/Sanskar-bot/clarifact',
    liveUrl: 'https://clarifact-web.onrender.com',
  },
  {
    name: 'PassGuard & VaultZero',
    catchphrase: 'Zero-knowledge password security, from analysis to vault.',
    description:
      'PassGuard: offline-first password strength analyzer as a browser extension with entropy scoring, Diceware passphrase generator, and k-anonymity breach check — main-thread time cut from ~87 ms to <1 ms. VaultZero: zero-knowledge password manager with Argon2id key derivation, AES-256-GCM encryption, BIP-39 recovery, and a 100+ endpoint API.',
    tags: ['JavaScript', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL', 'Argon2id', 'AES-256-GCM'],
    ticketNo: 'SP-03 / 07',
    screenshot: null,
    link: 'https://github.com/Sanskar-bot/PassGuard',
    liveUrl: 'https://passguard-two.vercel.app',
  },
  {
    name: 'PhishingCheck4U',
    catchphrase: 'Expose the phish before it hooks you.',
    description:
      'Transparent rule-based email phishing detection over 15 header features (SPF, DKIM, DMARC, Reply-To mismatches), enriched with WHOIS, AbuseIPDB and VirusTotal lookups. ~90% accuracy on 500 samples, false positives cut by 23%.',
    tags: ['Python', 'FastAPI', 'SQL'],
    ticketNo: 'SP-04 / 07',
    screenshot: null,
    link: 'https://github.com/Sanskar-bot/PhishingCheck4U',
    liveUrl: null,
  },
  {
    name: 'E2E Encryption Attack Lab',
    catchphrase: 'Encryption alone is not enough.',
    description:
      'Three-act man-in-the-middle demo: plaintext chat, encrypted chat with no key verification, encrypted chat with fingerprint verification. Built as a CyberPeace Foundation assignment.',
    tags: ['Python', 'RSA', 'AES-GCM', 'mitmproxy', 'Wireshark', 'Burp Suite'],
    ticketNo: 'SP-05 / 07',
    screenshot: null,
    link: 'https://github.com/Sanskar-bot/E2E-Encryption-Attack-Lab',
    liveUrl: null,
  },
  {
    name: 'TaskFlow',
    catchphrase: 'Clean REST, secure auth, modular layers.',
    description:
      'Scalable REST API for users and tasks with secure authentication and flexible querying, organized into modular service layers.',
    tags: ['Java', 'Spring Boot', 'PostgreSQL'],
    ticketNo: 'SP-06 / 07',
    screenshot: null,
    link: 'https://github.com/Sanskar-bot/A-Task-Management-REST-API-in-Java',
    liveUrl: null,
  },
  {
    name: 'SecureStream',
    catchphrase: 'Every frame encrypted, every stream verified.',
    description:
      'Self-hosted camera streaming with AES-128-GCM encryption per frame, PBKDF2-HMAC-SHA256 key derivation (100,000 iterations), served over HTTPS with a live dashboard.',
    tags: ['Python', 'Flask', 'TLS', 'AES-128-GCM'],
    ticketNo: 'SP-07 / 07',
    screenshot: null,
    link: 'https://github.com/Sanskar-bot/secure-media-encryption',
    liveUrl: null,
  },
];

// ────────────────────────────── Smaller Projects ──────────────────────────────

export type SmallerProject = {
  title: string;
  description: string;
  link: string | null;
};

export const smallerProjects: SmallerProject[] = [
  { title: 'Real-Time Data Pipeline', description: 'Real-time data pipeline with Apache Kafka (Java producers and consumers).', link: null },
  { title: 'Image Classification', description: 'Image classification with TensorFlow and OpenCV (Python).', link: null },
  { title: 'OOPS', description: 'Learning Python OOP by building small systems (banking, vehicles).', link: 'https://github.com/Sanskar-bot/OOPS' },
  { title: 'Embedded Firmware', description: 'Embedded C firmware on a microcontroller that reads and logs sensor data; a Linux kernel module in C.', link: null },
  { title: 'This Portfolio', description: 'This portfolio site (React, Next.js, TypeScript, Tailwind CSS).', link: 'https://github.com/Sanskar-bot/Sanskar_Phougat_Portfolio' },
];

// ────────────────────────────── Open Source ──────────────────────────────

export type OpenSourceItem = {
  title: string;
  description: string;
  link: string;
};

export const openSource: OpenSourceItem[] = [
  {
    title: 'SigmaHQ/sigma',
    description: 'Merged pull request (documentation and bug fix) to the widely used open-source detection-rules project, revised through maintainer review.',
    link: 'https://github.com/SigmaHQ/sigma',
  },
];

// ────────────────────────────── Learning in Public ──────────────────────────────

export type LearningItem = {
  title: string;
  description: string;
  link: string | null;
};

export const learningInPublic: LearningItem[] = [
  { title: 'Daily-Learnings', description: 'A public daily log of what I study and build, committed regularly.', link: 'https://github.com/Sanskar-bot/Daily-Learnings' },
  { title: 'NeetCode Submissions', description: 'DSA solutions synced from NeetCode.', link: 'https://github.com/Sanskar-bot/neetcode-submissions' },
  { title: 'LeetCode Progress', description: 'LeetCode practice tracker.', link: 'https://github.com/Sanskar-bot/Leetcode_Progress' },
  { title: 'Codeforces', description: 'Active competitive programmer.', link: null },
];

// ────────────────────────────── Leadership & Teaching ──────────────────────────────

export type LeadershipItem = {
  title: string;
  org: string;
  date: string;
  bullets: string[];
};

export const leadership: LeadershipItem[] = [
  {
    title: 'Technical Head',
    org: 'AI Tronics Society, JIIT Noida',
    date: 'Aug 2023 – Present',
    bullets: [
      'Designed and taught an Applied Cryptography workshop for 40+ students.',
      'Led Python and Git version-control sessions for 100+ participants.',
      'Taught three networking workshops of three days each.',
      'Mentored 8+ peer projects on system design.',
    ],
  },
];

// ────────────────────────────── Certifications ──────────────────────────────

export type CertificationItem = {
  title: string;
  issuer: string;
  detail?: string;
};

export const certifications: CertificationItem[] = [
  { title: 'Google Cybersecurity Certificate', issuer: 'Google' },
  { title: 'AWS Certification', issuer: 'Amazon Web Services' },
  { title: 'Salesforce Certification', issuer: 'Salesforce', detail: 'Trailhead Hiker rank — 3,075+ points' },
  { title: 'TryHackMe — Top 15% Globally', issuer: 'TryHackMe', detail: '40+ labs and rooms completed (networking, cryptography, Linux, security)' },
  { title: 'Jr Penetration Tester Path', issuer: 'TryHackMe', detail: 'In progress' },
  { title: 'Web Security Academy', issuer: 'PortSwigger', detail: 'In progress' },
  { title: 'MedVault Security Architecture', issuer: 'ICNSBT 2026', detail: 'Manuscript submitted' },
];
