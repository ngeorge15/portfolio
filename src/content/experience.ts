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
      "Building internal software alongside the engineering team, currently in active development.",
    points: [
      "Developing application features against an existing production codebase.",
      "Implementing changes through the team's review, testing and release process.",
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
    summary: "Undergraduate research appointment.",
    points: [],
    needsDetail: true,
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
  "I started in healthcare as a CNA. The work was direct and the impact was immediate, but it was bounded by what one person could do in a shift.",
  "I moved into computer science because software scales differently. The same care can be built into a system once and reach far more people than I could reach on a floor.",
  "What I like building sits between software and the physical world: firmware that has to survive a battery budget, a backend that has to make sense of noisy sensor data, an interface someone actually uses to decide something. Most of my work has ended up somewhere on that path from a sensor to a screen.",
] as const;
