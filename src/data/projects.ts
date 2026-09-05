export interface Project {
  slug: string;
  index: string;
  title: string;
  summary: string;
  detail: string;
  status: string;
  live?: boolean;
  tags: string[];
}

export const projects: Project[] = [
  {
    slug: "smart-ring",
    index: "01",
    title: "Local-First Biometric Platform",
    summary:
      "Reverse-engineered the undocumented Bluetooth protocol of a $20 smart ring, then built the entire health platform on top of it — pipeline, analysis engine, and an offline-capable dashboard, with no cloud and no vendor app in the loop.",
    detail:
      "The one existing open-source client covered heart rate and step counts. I found a second, unused GATT service carrying the sleep staging and SpO2 that were widely assumed unavailable on this hardware — and a body-temperature channel that appears in no public protocol documentation, including Gadgetbridge, the most complete open-source client for the device family.",
    status: "Shipped · live demo",
    live: true,
    tags: ["Python", "BLE / GATT", "Reverse engineering", "JavaScript", "PWA"],
  },
  {
    slug: "calorie-counter",
    index: "02",
    title: "Offline-First Calorie Tracker",
    summary:
      "An iOS app that scans, looks up, and logs meals with no network connection at all — then reconciles cleanly against the server the moment it reconnects.",
    detail:
      "The interesting part isn't the CRUD, it's the sync engine: client-minted UUIDs, server-authoritative timestamps, and tombstoned deletes, so an offline delete doesn't silently resurrect on the next sync. A fine-tuned food classifier reaches 95.05% top-3 on Food-101's test split; it hasn't been validated on real phone photos yet. Built end to end on a strictly free-tier stack to find out how far that actually goes.",
    status: "Working · classifier trained, not yet served",
    tags: ["React Native", "Expo", "Flask", "SQLite / Drizzle", "MongoDB"],
  },
  {
    slug: "kalshi-bot",
    index: "03",
    title: "Prediction-Market Trading System",
    summary:
      "A trading system for Kalshi that builds independent probability estimates from public data and looks for the places its model disagrees with the market.",
    detail:
      "Data ingest from nba_api and NOAA, a versioned model store with holdout validation, an edge detector, position sizer, and risk manager — plus a separate evaluator process that monitors performance, diagnoses failure patterns, and proposes improvements with guardrails against overfitting.",
    status: "Architecture complete · not yet run live",
    tags: ["Python", "nba_api", "NOAA / NWS", "SQLite", "Backtesting"],
  },
];
