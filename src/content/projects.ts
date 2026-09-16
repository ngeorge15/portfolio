/* Featured work.
   `repo` is populated only where a PUBLIC repository exists on the
   authenticated account (verified with `gh repo list`). gnome-firmware,
   gnome-backend and kalshi-bot are private, so they carry no link.
   `demo` is null everywhere: no repo has GitHub Pages or a homepage URL,
   so there is nothing real to link to. */

export interface Project {
  slug: string;
  title: string;
  value: string;
  role: string;
  tech: string[];
  /** One verifiable fact. Never a projection or an estimate. */
  proof: string;
  repo: string | null;
  demo: string | null;
  /** Which diagram component renders as this project's visual. */
  visual: "ring" | "gnome" | "market" | "calorie";
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "smart-ring",
    title: "Personal Smart Ring Platform",
    value:
      "A local-first health platform built on a $20 smart ring whose Bluetooth protocol was undocumented until I decoded it.",
    role: "Solo: protocol reverse engineering, data pipeline, analysis, frontend",
    tech: ["Python", "asyncio BLE", "SQLite", "React", "TypeScript"],
    proof: "Five health-data streams decoded from an undocumented GATT service",
    repo: "https://github.com/ngeorge15/smart-ring",
    demo: null,
    visual: "ring",
    featured: true,
  },
  {
    slug: "gnome",
    title: "Gnome",
    value:
      "A connected plant-care system: a custom ESP32-C6 sensor board reporting to an AWS backend that turns readings into specific care guidance.",
    role: "Founding Software Engineer: firmware, cloud, data, product, frontend",
    tech: ["ESP32-C6", "AWS Lambda", "MySQL", "React", "TypeScript"],
    proof:
      "1st Place and $20K at the Harriet Stephenson Business Plan Competition",
    repo: null,
    demo: null,
    visual: "gnome",
    featured: true,
  },
  {
    slug: "prediction-market-bot",
    title: "Prediction Market Trading Bot",
    value:
      "A research system that builds independent probability estimates for prediction markets and measures whether they are actually calibrated.",
    role: "Solo: data pipeline, modelling, validation harness",
    tech: ["Python", "scikit-learn", "pandas", "NumPy", "SQLite"],
    proof: "Calibration error below 0.05 on held-out sets",
    repo: null,
    demo: null,
    visual: "market",
    featured: true,
  },
  {
    slug: "ai-calorie-counter",
    title: "AI Calorie Counter",
    value:
      "An offline-first iOS calorie tracker with a food classifier trained, evaluated against a measured baseline, and exported for constrained serving.",
    role: "Solo: mobile, backend, training pipeline, evaluation",
    tech: ["React Native", "Flask", "PyTorch", "ONNX", "MongoDB"],
    proof:
      "85.78% top-1 on the Food-101 test split, +14.0 points over a frozen-backbone baseline",
    repo: "https://github.com/ngeorge15/ai-calorie-counter",
    demo: null,
    visual: "calorie",
    featured: true,
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
