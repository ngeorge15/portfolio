// Real material from the Colmi R02 reverse engineering.
// Layouts and the celsius scale come from smart-ring/PROTOCOL.md; the 48-slot
// temperature record is an actual capture (2026-08-31), zeros included —
// a zero means "no measurement", not a real reading.

export const SCAN_LO = 0x20;
export const SCAN_HI = 0x3f;

export interface TypeResult {
  type: number;
  name: string;
  bytes: string;
  layout: string;
  documented: boolean;
  note: string;
}

export const HITS: Record<number, TypeResult> = {
  0x25: {
    type: 0x25,
    name: "temperature",
    bytes: "50 B / day",
    layout: "[days_ago][interval][48 × uint8]",
    documented: false,
    note: "Not on colmi.puxtril.com, not in Gadgetbridge. Scale confirmed against the QRing app at 97–98 °F.",
  },
  0x27: {
    type: 0x27,
    name: "sleep",
    bytes: "variable",
    layout: "[n_days] then per day [days_ago][len][body]",
    documented: true,
    note: "Four-stage sleep. Stage constants cross-referenced against Gadgetbridge.",
  },
  0x2a: {
    type: 0x2a,
    name: "spo2",
    bytes: "49 B / day",
    layout: "[days_ago][48 × uint8]",
    documented: true,
    note: "Per-day record framing decoded from raw bytes.",
  },
};

// 2026-08-31, one slot per 30 minutes. 43 of 48 slots carry a measurement.
export const TEMP_RECORD = [
  169, 172, 166, 168, 167, 167, 167, 165, 166, 166, 167, 167,
  166, 161, 161, 162, 165, 163, 159, 164, 160, 166, 165, 162,
  165, 160, 161, 163,   0,   0, 165, 168, 168, 168, 166, 162,
  168, 168, 166, 166, 160, 165, 163, 168,   0,   0, 167,   0,
];

export const INTERVAL_MIN = 30;

/** PROTOCOL.md: celsius = raw / 10 + 20 */
export const toCelsius = (raw: number) => raw / 10 + 20;
export const toFahrenheit = (raw: number) => (toCelsius(raw) * 9) / 5 + 32;

export const hex = (n: number) => "0x" + n.toString(16).padStart(2, "0");
