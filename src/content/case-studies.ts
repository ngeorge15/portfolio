/* Long-form case studies, keyed by project slug.
   Sections are optional so a project only renders what it can honestly
   fill. A `Metric` without a `value` is one that has not been measured;
   it renders as an open slot rather than being quietly dropped or
   estimated. */

export interface Metric {
  label: string;
  /** Absent means not yet measured. Never fill in an estimate. */
  value?: string;
  note?: string;
}

export interface Decision {
  title: string;
  problem: string;
  options: string[];
  chose: string;
  /** The tradeoff. Every decision costs something; say what. */
  cost: string;
}

export interface CaseStudy {
  overview: string;
  problem: string;
  role: string;
  team: string;
  constraints: string[];
  architecture: { summary: string; steps: { name: string; detail: string }[] };
  decisions: Decision[];
  implementation: { title: string; body: string }[];
  validation: { summary: string; metrics: Metric[] };
  results: string[];
  limitations: string[];
}

export const caseStudies: Record<string, CaseStudy> = {
  /* ────────────────────────────────────────────────────────────────── */
  "smart-ring": {
    overview:
      "A $20 Colmi R02 smart ring ships with a minimal vendor app and no documented API. This project reverse-engineers its Bluetooth protocol, pulls the raw health data off it, and turns that into a local-first platform: a Python BLE client, a cleaning and persistence pipeline, and a React dashboard. No cloud service, no subscription, no vendor app in the loop.",

    problem:
      "Commercial rings pair capable sensors with closed ecosystems: the data lives on the vendor's servers and meaningful access costs a subscription. The R02 uses comparable hardware for a fraction of the price, but the only open-source client covered heart rate and step counts. Everything else the hardware measures was inaccessible, and several published assumptions about the device turned out to be wrong.",

    role: "Everything: protocol reverse engineering, BLE client, data pipeline, analysis, and frontend.",
    team: "Solo project.",

    constraints: [
      "No vendor documentation and no API. Every field had to be derived from raw notification bytes.",
      "The ring has no absolute clock in most of its data streams, so timestamps have to be inferred from an interval field and a day offset the device echoes back.",
      "BLE sessions are unreliable and the device disconnects readily, so every sync has to be resumable and safe to repeat.",
      "The device's own capability bitfield is not trustworthy, so every claimed feature had to be tested empirically rather than believed.",
    ],

    architecture: {
      summary:
        "Data moves in one direction: off the ring over BLE, through a cleaning stage, into local storage, and out to a dashboard. Each stage is independently runnable so a failure in one does not cost the data already collected.",
      steps: [
        {
          name: "Ring",
          detail:
            "Colmi R02: a PPG sensor and accelerometer exposing two GATT services, only one of which was publicly known.",
        },
        {
          name: "BLE client",
          detail:
            "A Python asyncio client that walks both services, handles multi-notification replies, and decodes each stream's wire format.",
        },
        {
          name: "Pipeline",
          detail:
            "Hampel filtering to reject sensor spikes, gap-aware interpolation that refuses to bridge real absences, and idempotent writes into SQLite.",
        },
        {
          name: "Dashboard",
          detail:
            "A React and TypeScript frontend reading the local database, with a second decode engine used to cross-check the Python one.",
        },
      ],
    },

    decisions: [
      {
        title: "Enumerating the type space instead of guessing at fields",
        problem:
          "The second GATT service accepted a request carrying a type byte, but only two type values were publicly known. Guessing at plausible values would likely have missed anything unusual.",
        options: [
          "Infer likely types from the vendor app's traffic",
          "Walk every type byte in the range and record what each returns",
        ],
        chose:
          "Walking the full range. Every type from 0x20 to 0x3f was probed in turn. Nearly all return a one-byte status; three return structured records. One of those, 0x25, carries body temperature and appears in no public protocol documentation, including Gadgetbridge, which is the most complete open-source client for this device family.",
        cost: "Slower than targeted guessing, and it produces a lot of uninteresting responses to sift through. It also only proves what the firmware answers on this device at this firmware version.",
      },
      {
        title: "Treating a decode as unproven until it is cross-checked",
        problem:
          "A byte-level decode can produce numbers that look entirely reasonable and still be wrong, which makes plausibility a poor test.",
        options: [
          "Accept decodes whose output falls in a physiologically sensible range",
          "Require each decode to agree with an independent source before it is trusted",
        ],
        chose:
          "Cross-checking. Decoded values were compared against real-time reads of the same metric, against the vendor app's own display, and against constants in independent open-source implementations. A second decode engine, written in JavaScript for the dashboard, is checked against the Python one so a mistake has to be made twice in two languages to survive.",
        cost: "Considerably more work per stream, and it meant discarding some early decodes that looked fine. It is the reason the endianness bug below was caught rather than shipped.",
      },
      {
        title: "Local-first storage rather than a backing service",
        problem:
          "Health data has to live somewhere, and a hosted database would have made the dashboard simpler to build.",
        options: [
          "A small hosted backend with an API",
          "A local SQLite database the dashboard reads directly",
        ],
        chose:
          "Local SQLite, with idempotent writes so a repeated or partially-failed sync cannot duplicate rows. The entire point of the project was to remove the vendor's cloud from the path; replacing it with my own would have kept the dependency and added an operating cost.",
        cost: "No multi-device sync and no access away from the machine holding the database. Getting data onto a phone required a separate handoff path rather than simply calling an API.",
      },
    ],

    implementation: [
      {
        title: "A silent endianness bug that looked correct",
        body: "Reading the HRV history stream big-endian produces numbers identical to the correct little-endian reading for as long as values stay under 256, because the high byte is zero either way. It also swallows the day-offset echo at the start of the stream as a harmless-looking zero. The decode was wrong from the start and would have kept looking right until the first HRV reading above 255 ms, or the first request for a day other than today, at which point the echo would parse as a 256 ms reading. It was caught by cross-checking rather than by inspection.",
      },
      {
        title: "Multi-message replies",
        body: "A single request can be answered by several notifications, each carrying its own six-byte header. Reading the first payload and truncating to its declared length returns one record and silently interprets the following headers as data. The client walks the framing instead, reading header and length repeatedly until the reply is exhausted.",
      },
      {
        title: "The ring has no timezone",
        body: "The set-time command carries BCD date and time digits with no offset field, so the device stores whatever wall-clock digits it is handed. A client that helpfully converts to UTC puts the ring hours away from local time and splits the database across two timezones mid-day. Since sleep is circadian, local wall-clock is the correct choice, and timestamps are stored as naive local time with a guard that deletes impossible future-dated rows.",
      },
      {
        title: "Gaps are not zeroes",
        body: "Streams use a fixed number of slots per day and write zero where no measurement was taken. Treating those as readings would drag every average down and draw a temperature trace that dives toward 20 °C. The pipeline carries absence through as absence: interpolation refuses to bridge a real gap, and the dashboard lifts the pen rather than connecting across one.",
      },
    ],

    validation: {
      summary:
        "Each decoded stream was checked against something outside itself before being trusted. The assertion count below covers the cross-engine suite that holds the Python and JavaScript decoders to the same results.",
      metrics: [
        { label: "Cross-checked assertions across the platform", value: "101" },
        { label: "Health-data streams decoded", value: "5" },
        {
          label: "Undocumented streams found",
          value: "1",
          note: "Body temperature, absent from public protocol documentation and from Gadgetbridge.",
        },
        {
          label: "Approximate size",
          value: "~4,000 lines across three runtimes",
          note: "Python client and pipeline, JavaScript decode engine, React frontend.",
        },
        {
          label: "Sensor accuracy against a medical reference",
          note: "Not measured. Decodes are verified against the vendor app and independent implementations, which establishes that the bytes are being read correctly, not that the sensor is accurate.",
        },
      ],
    },

    results: [
      "Five health-data streams decoded from a device whose protocol was undocumented, including one stream that no public source describes.",
      "A working local-first pipeline: sync, clean, persist and display, with no vendor service involved.",
      "Two independent decode implementations that agree, which is what makes the readings trustworthy rather than merely plausible.",
    ],

    limitations: [
      "The ring is not calibrated. Decodes are verified as correct readings of the device's own output; the accuracy of the underlying sensors against a medical reference has not been measured and is not claimed.",
      "Temperature is reported on the scale the vendor app displays, confirmed against that app rather than against a clinical thermometer.",
      "Timestamps on several streams are inferred from an interval field rather than carried by the device, and are stored flagged as inferred.",
      "Findings apply to this device on this firmware version. Other units or firmware revisions may differ.",
      "The device's capability bitfield claims support for features that do not work, so it is treated as a claim to test rather than a source of truth.",
    ],
  },

  /* ────────────────────────────────────────────────────────────────── */
  gnome: {
    overview:
      "Gnome is a connected plant-care product. A custom ESP32-C6 sensor board reads the conditions around a plant, batches those readings on a strict power budget, and sends them to an AWS backend that turns them into specific, plant-aware care guidance for both indoor and outdoor plants.",

    problem:
      "Plant care advice is generic while plant conditions are specific. A plant's actual light, moisture and temperature vary by window, season and room, and a care schedule written for a species cannot account for any of that. Measuring the real conditions is straightforward; doing it on a battery, cheaply enough to sit in a pot, and turning the readings into advice someone will act on is the hard part.",

    role: "Founding Software Engineer, owning firmware, cloud infrastructure, data model, product and frontend.",
    team: "Founding team; I own engineering end to end.",

    constraints: [
      "Battery life dominates the design. The board has to sleep far more than it runs, which constrains how often anything can be measured or transmitted.",
      "Wi-Fi is the most power-expensive thing the device does and the noisiest, which affects both the power budget and the analog readings.",
      "Sensor readings must survive power loss and network failure without being lost.",
      "Many devices reporting on the same cadence would create avoidable load spikes on the backend.",
    ],

    architecture: {
      summary:
        "Readings flow from sensor to screen through a deliberately buffered path. The device favours sleeping and batching over reporting promptly, and the backend decouples ingestion from processing so a burst of devices cannot stall either.",
      steps: [
        {
          name: "Sensor board",
          detail:
            "A custom ESP32-C6 board reading five sensors over ADC and I2C.",
        },
        {
          name: "Firmware",
          detail:
            "A 15-minute deep-sleep cycle, readings accumulated in RTC memory, with NVS as the fallback store, transmitted in hourly batches.",
        },
        {
          name: "Cloud",
          detail:
            "API Gateway into Lambda, SQS decoupling ingestion from processing, S3 for artifacts, and RDS holding a seven-table MySQL schema.",
        },
        {
          name: "Product",
          detail:
            "React and TypeScript interfaces presenting the plant's condition and Gemini-generated care guidance grounded in that plant's readings.",
        },
      ],
    },

    decisions: [
      {
        title: "Sample before bringing up Wi-Fi",
        problem:
          "The analog sensors and the radio share a power domain. Taking readings while Wi-Fi is active pulls the analog measurements around and produces noise that looks like real variation in the data.",
        options: [
          "Sample and transmit together to minimise awake time",
          "Sample first with the radio down, then bring Wi-Fi up to transmit",
        ],
        chose:
          "Sampling first, with the radio off, then powering Wi-Fi only once readings are safely in RTC memory. Cleaning up analog interference in software after the fact is guesswork; not introducing it is deterministic.",
        cost: "The device is awake marginally longer per cycle than a combined sample-and-send would be, and the firmware carries the extra state of holding readings across a radio transition.",
      },
      {
        title: "Batch hourly instead of reporting every reading",
        problem:
          "Plant conditions change slowly, but a naive design reports each reading as it is taken, paying the full Wi-Fi power cost every fifteen minutes.",
        options: [
          "Transmit on every sample for the freshest data",
          "Accumulate in RTC memory and transmit once an hour",
        ],
        chose:
          "Hourly batches, with samples held in RTC memory across deep sleep and NVS as a fallback if power is lost. The radio dominates the energy budget, so cutting transmissions by three quarters buys far more battery life than fresher data is worth for a plant.",
        cost: "Readings can be up to an hour stale by the time they reach the backend, and the firmware has to manage a buffer and its fallback rather than fire and forget.",
      },
      {
        title: "Stagger transmission timing across devices",
        problem:
          "Devices on a fixed hourly cadence tend to align, so many units report in the same narrow window and the backend sees a spike followed by idle time.",
        options: [
          "Fixed hourly transmission, scaled backend to absorb the peak",
          "Stagger each device's transmission slot",
        ],
        chose:
          "Staggering, so load arrives spread across the hour rather than concentrated. Combined with SQS between ingestion and processing, this means a burst is absorbed as queue depth instead of failed requests.",
        cost: "Device reporting times are no longer predictable, which makes 'has this device checked in' slightly more involved to reason about than a fixed schedule would be.",
      },
    ],

    implementation: [
      {
        title: "State that survives deep sleep",
        body: "Deep sleep clears normal memory, so accumulated readings live in RTC memory, which persists across sleep cycles but not across power loss. NVS backs that up for the power-loss case. The firmware treats a transmission as complete only once acknowledged, so an interrupted send does not silently discard an hour of readings.",
      },
      {
        title: "Decoupled ingestion",
        body: "The endpoint's only job is to accept a batch and enqueue it. Processing happens behind SQS, which means a slow database or a processing error does not turn into a failed request at the device, where retrying is expensive in power terms.",
      },
      {
        title: "Grounded guidance rather than generic advice",
        body: "Care guidance is generated with Gemini, but conditioned on that specific plant's recent readings and species rather than asked in the abstract. The value is in the grounding: the same model asked a generic question returns advice indistinguishable from a search result.",
      },
    ],

    validation: {
      summary:
        "This is an active commercial product, and its engineering metrics are not public. The externally verifiable result to date is the competition outcome and the customer research the team completed.",
      metrics: [
        {
          label: "Harriet Stephenson Business Plan Competition",
          value: "1st Place, $20,000",
        },
        {
          label: "Customer interviews completed by the team",
          value: "100+",
          note: "Completed later, during Redhawk Venture Lab. Separate from and subsequent to the competition result above.",
        },
        { label: "Sensors sampled per cycle", value: "5" },
        { label: "Deep-sleep cycle", value: "15 minutes" },
        {
          label: "Field battery life and delivery rates",
          note: "Measured internally; not published here.",
        },
      ],
    },

    results: [
      "A working sensor-to-guidance product spanning custom hardware, firmware, cloud infrastructure and a customer-facing interface.",
      "1st Place and a $20,000 award at the Harriet Stephenson Business Plan Competition.",
      "Over 100 customer interviews completed by the team during Redhawk Venture Lab, subsequent to the competition, which shaped the product direction.",
    ],

    limitations: [
      "Source code and infrastructure configuration are proprietary and not published, so this case study describes architecture and decisions rather than linking to an implementation.",
      "Readings can be up to an hour old by design; this is not a real-time system and is not intended to be.",
      "Care guidance is model-generated from measured conditions. It is decision support, not a horticultural guarantee.",
      "Operational metrics such as battery life in the field are measured internally and deliberately not quoted here.",
    ],
  },

  /* ────────────────────────────────────────────────────────────────── */
  "prediction-market-bot": {
    overview:
      "A research system that builds its own probability estimates for prediction-market events, in sport and in weather, and then measures whether those estimates are calibrated. The emphasis is on the validation: an estimate that is confidently wrong is worse than no estimate, so most of the work is in testing honestly rather than in modelling.",

    problem:
      "Any model can produce a number between zero and one. The question that matters is whether an event the model calls 70% likely actually happens about 70% of the time. Standard machine-learning validation makes this easy to get wrong on time-series data, where shuffling rows lets information from the future leak into training and produces backtests that look excellent and mean nothing.",

    role: "Solo: data ingestion, modelling, validation harness, and execution logic.",
    team: "Solo project.",

    constraints: [
      "All inputs come from free public sources, so the system works with what is openly available rather than paid feeds.",
      "Time-ordering must be respected everywhere. Any evaluation that lets a model see data from after the event it predicts is worthless.",
      "Execution has to be deterministic and reproducible, which rules out a language model anywhere in the decision path.",
    ],

    architecture: {
      summary:
        "Ingestion, modelling, validation and execution are separate stages with a local database between them, so a model can be re-evaluated against stored history without re-fetching anything.",
      steps: [
        {
          name: "Ingestion",
          detail:
            "Public sport and weather data pulled and stored locally in SQLite.",
        },
        {
          name: "Models",
          detail:
            "ELO-based team ratings, player-level projections, and ensemble weather models, built with scikit-learn, pandas and NumPy.",
        },
        {
          name: "Validation",
          detail:
            "Temporal train, test and holdout splits with walk-forward validation, scoring calibration rather than raw accuracy.",
        },
        {
          name: "Execution",
          detail:
            "Deterministic rules comparing model probability against market price, kept strictly separate from any model-assisted analysis.",
        },
      ],
    },

    decisions: [
      {
        title: "Temporal splits and walk-forward validation, not random splits",
        problem:
          "A random train/test split on time-series data trains on rows that occur after the rows it is evaluated on. The resulting backtest is optimistic and unreproducible in live conditions.",
        options: [
          "Random k-fold splits, which are standard and simple",
          "Strict temporal splits with walk-forward validation",
        ],
        chose:
          "Temporal splits with a held-out period the model never sees during development, validated walk-forward so each prediction uses only data available before that event. This is the difference between a backtest that means something and one that does not.",
        cost: "Far less usable training data per evaluation, noisier results, and materially worse headline numbers than a random split would have produced.",
      },
      {
        title: "Scoring calibration rather than accuracy",
        problem:
          "Accuracy rewards a model for being right and says nothing about whether its confidence is meaningful, which is exactly what matters when the output is a probability compared against a price.",
        options: [
          "Optimise and report classification accuracy",
          "Optimise and report calibration error",
        ],
        chose:
          "Calibration. The system reports calibration error on held-out sets, and reaches below 0.05 there. A model that says 70% and is right 70% of the time is useful even when it is frequently wrong; a model that is accurate but overconfident is not.",
        cost: "Calibration error is a less immediately impressive headline than an accuracy percentage, and it is harder to explain.",
      },
      {
        title: "Keeping the language model out of the decision path",
        problem:
          "A language model is genuinely useful for reviewing parameter choices and surfacing patterns, but anything non-deterministic in the execution path makes results impossible to reproduce or audit.",
        options: [
          "Let a model participate in decisions directly",
          "Restrict it to offline analysis, with execution fully deterministic",
        ],
        chose:
          "Strict separation. Execution is deterministic code whose behaviour can be replayed exactly. Model-assisted work is confined to evaluating parameters offline, where its suggestions are inputs to a human decision rather than actions.",
        cost: "Gives up whatever a model might contribute in the moment, and keeps a manual step between analysis and any change.",
      },
    ],

    implementation: [
      {
        title: "Local database as the boundary between stages",
        body: "Ingested data lands in SQLite and every later stage reads from there. Models can be rebuilt and re-scored against identical history without re-fetching, which is what makes results comparable across iterations.",
      },
      {
        title: "Separate models for separate domains",
        body: "Sport and weather have almost nothing in common as prediction problems. Sport uses ELO-derived ratings and player projections; weather uses an ensemble of public forecast data. They share the validation harness and nothing else.",
      },
    ],

    validation: {
      summary:
        "Validation is the point of the project. Calibration is measured on a holdout period the model does not see during development.",
      metrics: [
        {
          label: "Calibration error on holdout sets",
          value: "below 0.05",
          note: "Measured on held-out periods, using temporal splits and walk-forward validation.",
        },
        {
          label: "Live trading performance",
          note: "Not measured. The system has not been run live, and no profitability is claimed or implied.",
        },
        {
          label: "Realised returns",
          note: "Not measured, for the same reason.",
        },
      ],
    },

    results: [
      "Calibrated probability estimates, verified below 0.05 calibration error on held-out periods rather than on data the models were tuned against.",
      "A validation harness that respects time ordering throughout, which is what makes those numbers meaningful.",
      "A deterministic, reproducible execution path with model-assisted analysis kept strictly outside it.",
    ],

    limitations: [
      "This has never been run live. There are no trades, no profit and loss, and no realised returns, and none are implied.",
      "Calibration below 0.05 on a holdout set says the probabilities are honest. It does not say they beat the market, which is a separate and harder question.",
      "The source repository is private, so this case study describes the system rather than linking to it.",
      "All inputs are free public sources, which bounds what the models can know.",
    ],
  },

  /* ────────────────────────────────────────────────────────────────── */
  "ai-calorie-counter": {
    overview:
      "A calorie tracker whose core action, logging a meal, never touches the network. Barcode scanning, an on-device meal log, a sync engine that reconciles cleanly on reconnect, and a food classifier trained and evaluated against a measured baseline. Built end to end on infrastructure that costs nothing, to find out where that actually breaks.",

    problem:
      "Most calorie trackers either charge past a trial or gesture at 'just take a photo' without a real classifier behind it. Building both honestly on free infrastructure means confronting what free tiers actually do: sleep when idle, cap memory, and rate-limit.",

    role: "Solo: mobile app, backend, training pipeline, and evaluation harness.",
    team: "Solo project.",

    constraints: [
      "Every component runs on a free tier: Render's free web service, MongoDB Atlas M0, a free USDA FoodData Central key, and Kaggle's free GPU for training.",
      "A free Render instance sleeps when idle and has roughly 512MB of RAM, which is why logging had to work offline and why the model is served as ONNX rather than PyTorch.",
      "The phone must be fully functional with no connectivity at all, which makes sync a reconciliation problem rather than a request.",
    ],

    architecture: {
      summary:
        "The phone owns the meal log and works alone. The backend is a cache and a classifier that the phone can reach when it happens to be online.",
      steps: [
        {
          name: "Phone",
          detail:
            "React Native with barcode scanning and an on-device SQLite meal log that works with no network.",
        },
        {
          name: "Sync engine",
          detail:
            "Client-minted UUIDs, server-authoritative timestamps and tombstoned deletes, so reconnecting reconciles rather than overwrites.",
        },
        {
          name: "Backend",
          detail:
            "Flask on Render, caching nutrition lookups in MongoDB and falling back from USDA to Open Food Facts.",
        },
        {
          name: "Classifier",
          detail:
            "A fine-tuned efficientnet_lite0 exported to ONNX and served within the free tier's memory budget.",
        },
      ],
    },

    decisions: [
      {
        title: "Server-side inference, not on-device",
        problem:
          "The rest of the app is deliberately offline-first, which argues for running the classifier on the phone too. A free-tier server also sleeps, making a cold classify request slow.",
        options: [
          "Core ML on-device: no network dependency, consistent with the app's offline-first design",
          "Server-side: simpler mobile code, model improvable without shipping a new build",
        ],
        chose:
          "Server-side, after noticing the offline-first argument does not actually hold here. The classifier's output is a search query, and resolving it to real nutrition data needs the network regardless, so on-device inference would not have bought an offline path. What remained was that every model improvement would otherwise require re-exporting, re-signing and reinstalling the app.",
        cost: "A cold instance makes the first classify request slow, and the app now depends on a network path it could have avoided. On-device remains a stretch goal, and the backbone was chosen to keep that a re-export rather than a re-architecture.",
      },
      {
        title: "Fine-tuning a pretrained backbone, not training from scratch",
        problem:
          "Training from random initialisation sounds more impressive, and whether it would actually perform better deserved an answer rather than an assumption.",
        options: [
          "Train from scratch on Food-101",
          "Fine-tune an ImageNet-pretrained backbone",
        ],
        chose:
          "Fine-tuning. At roughly 1,000 images per class, a network large enough to separate 101 visually similar dishes has far more capacity than the data can constrain from a random start. Pretrained weights already encode general visual features; fine-tuning adapts them.",
        cost: "The honest headline is 'I fine-tuned a model', not 'I trained one from zero'. The training loop, data pipeline, evaluation harness and export are still mine.",
      },
      {
        title: "Measuring the baseline instead of quoting a flattering one",
        problem:
          "Reporting a fine-tuned model's accuracy alone says nothing about what fine-tuning contributed. The convenient comparison, an untrained head, scores near chance and makes any number look enormous.",
        options: [
          "Report accuracy against an untrained head",
          "Train a linear probe on the frozen backbone as the real baseline",
        ],
        chose:
          "The linear probe. Freezing the backbone and training only a fresh classifier head isolates the actual question: how separable are the pretrained features, and therefore what did unfreezing buy? The answer is a measured 14.0 points, not the meaningless 84-point gap the untrained comparison would have produced.",
        cost: "An entire extra training run purely to produce a less impressive headline number.",
      },
    ],

    implementation: [
      {
        title: "Offline deletes that stay deleted",
        body: "A delete performed offline is recorded as a tombstone rather than a row removal. Without that, the next sync sees a row on the server and no row on the client, concludes the client is missing data, and resurrects the deleted meal. Client-minted UUIDs mean the phone can create records with stable identity before it has ever spoken to the server.",
      },
      {
        title: "Verifying the export rather than trusting it",
        body: "A preprocessing or export mismatch between PyTorch and ONNX degrades accuracy silently, with no error anywhere. Outputs from both were compared directly and agree to 5.7e-06, which makes the exported model demonstrably the one that was evaluated.",
      },
      {
        title: "Serving memory measured, not assumed",
        body: "Serving ONNX instead of PyTorch was chosen on the argument that torch would not fit the free tier. That argument was then measured: the ONNX stack peaks around 136MB against roughly 310MB for a like-for-like PyTorch stack, against a budget near 512MB.",
      },
    ],

    validation: {
      summary:
        "The evaluation plan was written before any of these numbers existed, so it could not be bent to fit whatever came out. Anything not yet measured is listed as such rather than estimated.",
      metrics: [
        {
          label: "Top-3 accuracy, Food-101 test set",
          value: "95.05%",
          note: "The metric that matters for the product: the app only needs the right food somewhere in the top three to seed a useful nutrition search.",
        },
        {
          label: "Top-1 accuracy, Food-101 test set",
          value: "85.78%",
          note: "Fine-tuned efficientnet_lite0, 15 epochs, official manually-verified test split.",
        },
        {
          label: "Gain from fine-tuning the backbone",
          value: "+14.0 points",
          note: "Against a linear probe on the frozen ImageNet features, which reaches 71.75% top-1.",
        },
        { label: "Exported model size", value: "13.3MB" },
        {
          label: "PyTorch vs ONNX output divergence",
          value: "5.7e-06 max",
          note: "Verified rather than assumed.",
        },
        {
          label: "Accuracy on real phone photos",
          note: "Not measured. The harness exists but needs a held-out set of real photos shot in real lighting. Food-101 test accuracy only proves the model learned Food-101.",
        },
        {
          label: "Server inference latency, cold and warm",
          note: "Not measured. Pending deployment to the real free-tier instance; local timings are not a substitute.",
        },
      ],
    },

    results: [
      "A classifier at 85.78% top-1 and 95.05% top-3 on the Food-101 test split, with fine-tuning worth a measured 14.0 points over a real baseline.",
      "A meal log that works with no connectivity and reconciles correctly on reconnect, including deletes performed offline.",
      "The whole system running within free-tier limits, with the memory argument for ONNX measured rather than assumed.",
    ],

    limitations: [
      "The classifier has only been evaluated on Food-101. Accuracy on real phone photos in real lighting is unmeasured, and is the number that would actually matter in use.",
      "Inference latency on the deployed free tier is unmeasured, since the classify endpoint has not been deployed.",
      "A cold Render instance makes the first classify request slow.",
      "Nutrition data is only as good as the USDA and Open Food Facts entries behind it.",
    ],
  },
};

export const getCaseStudy = (slug: string) => caseStudies[slug];
