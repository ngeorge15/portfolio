/* Experience.
   Societies Insurance is ongoing: present-tense verbs only, no claim that
   any platform has shipped, and nothing describing proprietary systems or
   client data.

   Gnome's chronology is load-bearing and must not be flattened. The
   Harriet Stephenson win came first; the 100+ customer interviews happened
   afterwards, during Redhawk Venture Lab. They are separate events and
   neither caused the other. */

export interface Role {
  org: string;
  title: string;
  start: string;
  end: string | null;
  summary: string;
  points: string[];
  /** Set where detail is still owed by Nikhil rather than invented here. */
  needsDetail?: boolean;
}

export const experience: Role[] = [
  {
    org: "Societies Insurance",
    title: "Software Engineer Intern",
    start: "Sep 2026",
    end: null,
    summary:
      "Working on internal software with the engineering team; the work is ongoing.",
    points: [
      "Architecting a relational model that separates shared policy fields from flexible product-specific details across 30+ insurance product lines and 47+ carrier/MGA relationships.",
      "Designing a canonical-to-carrier field-mapping layer and a staged intake, migration and administrative review workflow with Django, PostgreSQL and AWS.",
    ],
    needsDetail: true,
  },
  {
    org: "Gnome",
    title: "Founding Software Engineer",
    start: "Jan 2026",
    end: null,
    summary:
      "Founding engineer on a connected plant-care product, owning firmware, cloud, data and the customer-facing interfaces.",
    points: [
      "Designed the firmware for a custom ESP32-C6 sensor board sampling five sensors over ADC and I2C on a 15-minute deep-sleep cycle.",
      "Built the AWS backend behind it: Lambda, API Gateway, SQS, S3 and RDS, with a seven-table MySQL schema.",
      "Built the React and TypeScript product interfaces, including Gemini-backed care guidance for indoor and outdoor plants.",
      "Won 1st Place and $20,000 at the Harriet Stephenson Business Plan Competition.",
      "Later, during Redhawk Venture Lab, the team completed over 100 customer interviews that shaped the product direction.",
    ],
  },
  {
    org: "University of Washington",
    title: "Undergraduate Researcher",
    start: "Jan 2025",
    end: "Jun 2025",
    summary:
      "Researching braid theory with finite automata and custom domain-specific languages.",
    points: [
      "Built visualization tools for mathematical structures and used computer-vision verification to check generated results.",
    ],
  },
];

/* Verified proof points shown on the home page. Each maps to something
   checkable: a competition result, a count of decoded protocol streams, or
   a test-suite assertion count. */
export const credibility = [
  {
    figure: "1st Place",
    label: "Harriet Stephenson Business Plan Competition, with a $20,000 award",
  },
  {
    figure: "100+",
    label: "Team customer interviews completed during Redhawk Venture Lab",
  },
  {
    figure: "5",
    label: "Health-data streams decoded from an undocumented BLE service",
  },
  {
    figure: "101",
    label: "Cross-checked assertions across the Smart Ring platform",
  },
] as const;

export const about = [
  "I started in healthcare as a CNA, then moved into computer science to build systems with broader reach.",
  "I’m particularly interested in software that connects physical devices, data, and the decisions people make from them.",
] as const;

export const education = {
  school: "University of Washington",
  degree: "B.S. Computer Science",
  dates: "September 2023 – June 2027",
  location: "Seattle, Washington",
  coursework: [
    "Operating Systems",
    "Machine Learning",
    "Systems Programming",
    "Data Structures and Parallelism",
    "Databases",
    "Hardware/Software Interface",
    "Software Design",
    "Digital Design",
    "Computational Biology",
  ],
} as const;

export const skills = {
  Languages: ["Java", "Python", "C", "C++", "JavaScript", "TypeScript", "SQL"],
  "Frameworks and Product": ["React", "React Native", "Flask", "Django", "Node.js"],
  "Cloud and Data": ["AWS Lambda", "API Gateway", "SQS", "S3", "RDS", "MySQL", "PostgreSQL", "MongoDB", "SQLite"],
  "Embedded and Tools": ["ESP32-C6", "ADC", "I2C", "LittleFS", "Git", "Docker", "Linux", "Windows", "Claude Code + Codex"],
} as const;
