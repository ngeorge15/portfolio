/* ── Case-study content ───────────────────────────────────────────────
   Long-form detail for /projects/[slug]. Keyed by the same slug as
   projects.ts, which stays the source of truth for title/status/tags.

   A metric with no `value` is one that hasn't been measured yet, and it
   renders that way — same reasoning as the colour tokens in global.css:
   the distinction between what's been measured and what's merely
   expected is the substance, so it's encoded in the data, not written
   around in prose.
   ------------------------------------------------------------------- */

export interface Metric {
  label: string;
  /** Absent means not yet measured. Do not fill in an estimate. */
  value?: string;
  method?: string;
  methodHref?: string;
}

export interface Decision {
  title: string;
  problem: string;
  options: string[];
  chose: string;
  cost: string;
}

export interface WarStory {
  title: string;
  body: string;
  href?: string;
  hrefLabel?: string;
}

export interface CaseStudy {
  lede: string;
  constraint?: { title: string; body: string };
  metrics?: { title: string; note?: string; items: Metric[] };
  decisions?: Decision[];
  warStories?: WarStory[];
  limitations?: { title: string; note?: string; items: string[] };
  links?: { label: string; href: string; note?: string }[];
}

export const caseStudies: Record<string, CaseStudy> = {
  "calorie-counter": {
    lede:
      "A calorie tracker whose core action — log this meal — never touches the network. " +
      "Barcode scanning, an on-device meal log, a sync engine that reconciles cleanly on " +
      "reconnect, and a food classifier trained from a photo dataset. Built end to end on " +
      "infrastructure that costs nothing, to find out where that actually breaks.",

    constraint: {
      title: "The constraint",
      body:
        "Every piece of this runs on a free tier: Render's free web service, MongoDB Atlas " +
        "M0, a free USDA FoodData Central key, Kaggle's free GPU for training. That isn't " +
        "a budget note — it's the thing that shaped the architecture. A free Render instance " +
        "sleeps when idle and has roughly 512MB of RAM, which is why logging a meal had to " +
        "work offline rather than round-trip to a server that might be asleep, and why the " +
        "classifier is served as ONNX rather than PyTorch (importing torch alone would eat " +
        "most of that memory budget).",
    },

    metrics: {
      title: "What's measured",
      note:
        "The evaluation plan was written before any of these numbers existed, so it " +
        "couldn't be bent to fit whatever came out. Anything not yet measured is listed " +
        "as such rather than estimated.",
      items: [
        {
          label: "Top-3 accuracy, Food-101 test set",
          value: "95.05%",
          method:
            "The metric that matters for this product: the app only needs the right food " +
            "somewhere in the top 3 to seed a useful nutrition search.",
        },
        {
          label: "Top-1 accuracy, Food-101 test set",
          value: "85.78%",
          method:
            "fine-tuned efficientnet_lite0, 15 epochs, official manually-verified test split",
        },
        {
          label: "Gain from fine-tuning the backbone",
          value: "+14.0 points",
          method:
            "A linear probe on the frozen ImageNet features reaches 71.75% top-1, so " +
            "unfreezing the backbone is worth a measured amount rather than an assumed " +
            "one. The naive version of this comparison — an untrained head — scores " +
            "1.08%, which is chance on 101 classes and would have made the number " +
            "meaningless.",
        },
        {
          label: "Model size",
          value: "13.3MB",
          method: "ONNX export, opset 17, dynamic batch dimension",
        },
        {
          label: "PyTorch vs. ONNX output divergence",
          value: "5.7e-06 max",
          method:
            "Verified rather than assumed — a silent preprocessing or export mismatch " +
            "degrades accuracy with no error anywhere.",
        },
        {
          label: "Accuracy on real phone photos",
          method:
            "Harness is built; needs a held-out set of real photos shot in real lighting. " +
            "Food-101 test accuracy only proves the model learned Food-101.",
        },
        {
          label: "Server inference latency, cold and warm",
          method:
            "Pending deployment. This is the direct check on the call to serve inference " +
            "server-side rather than on-device.",
        },
      ],
    },

    decisions: [
      {
        title: "Server-side inference, not on-device",
        problem:
          "The rest of the app is deliberately offline-first, which argues for running the " +
          "classifier on the phone too. A free-tier server also sleeps, making a cold " +
          "classify request slow.",
        options: [
          "Core ML on-device: no network dependency, no server cost, consistent with the app's offline-first design",
          "Server-side: simpler mobile code, model improvable without shipping a new build",
        ],
        chose:
          "Server-side — after noticing the offline-first argument doesn't actually hold " +
          "here. The classifier's output is a search query, and resolving it to real " +
          "nutrition data requires the network regardless, so on-device inference wouldn't " +
          "have bought an offline path. What remained was that every model improvement " +
          "would otherwise require re-exporting, re-signing, and reinstalling through " +
          "SideStore — punishing iteration on the part that's actually hard.",
        cost:
          "A cold instance makes the first classify request slow, and the app now needs a " +
          "network path it could have avoided. On-device remains a stretch goal; the " +
          "backbone was chosen to make that a re-export rather than a re-architecture.",
      },
      {
        title: "Fine-tuning a pretrained backbone, not training from scratch",
        problem:
          "Training a classifier from random initialisation sounds more impressive, and " +
          "the question of whether it would actually perform better deserved an answer.",
        options: [
          "Train from scratch on Food-101",
          "Fine-tune an ImageNet-pretrained backbone",
        ],
        chose:
          "Fine-tuning. At Food-101's scale — about 1,000 images per class — a network big " +
          "enough to separate 101 visually similar dishes has far more capacity than the " +
          "data can constrain from a random start. Pretrained weights already encode " +
          "general visual features learned from millions of images; fine-tuning adapts them.",
        cost:
          "The headline is 'I fine-tuned a model,' not 'I trained one from zero.' That's " +
          "the honest description of the right engineering call, and the training loop, " +
          "data pipeline, evaluation harness, and export are all still mine.",
      },
      {
        title: "USDA FoodData Central as the primary barcode source",
        problem:
          "Open Food Facts is the obvious open-data choice for barcode lookup, but its US " +
          "branded-product coverage is thin — and a scan that returns nothing is a dead end " +
          "at exactly the moment the user is trying to log something.",
        options: [
          "Open Food Facts primary, USDA fallback",
          "USDA primary, Open Food Facts fallback",
        ],
        chose:
          "USDA primary, OFF fallback, then user contribution. FDC carries far more US " +
          "branded products, and the chain means a miss at one layer isn't a dead end.",
        cost:
          "USDA has no barcode endpoint at all — the UPC has to go in as a free-text search " +
          "query, and every fuzzy result has to be re-verified against the returned GTIN " +
          "before it can be trusted.",
      },
      {
        title: "Sync cursors come from the server clock, never the client's",
        problem:
          "An offline-first log needs a cursor to track what a device has already seen. The " +
          "obvious implementation stamps each change with the device's own clock.",
        options: [
          "Client-stamped timestamps, simple and fully offline",
          "Server-authoritative timestamps assigned on write",
        ],
        chose:
          "Server-authoritative. A phone running even slightly fast would otherwise push a " +
          "future-stamped meal, adopt that timestamp as its own cursor, and permanently " +
          "stop seeing every server change written in the gap behind it — silent, " +
          "unrecoverable data loss that no error would ever surface.",
        cost:
          "Cursors also have to be floored to millisecond precision, because BSON truncates " +
          "microseconds and reintroduced the same skip one layer down.",
      },
    ],

    warStories: [
      {
        title: "Every VisionCamera tutorial online is wrong for this codebase",
        body:
          "VisionCamera v5 is a Nitro-based ground-up rewrite. useCodeScanner is gone, " +
          "replaced by useObjectOutput with ScannedObject narrowing; codes, faces and bodies " +
          "now share one object-detection pipeline. It also ships no Expo config plugin, so " +
          "the config entry every v3/v4 tutorial shows is invalid — Expo silently loads the " +
          "package main instead and then fails at prebuild. Camera permissions have to be " +
          "declared through app.json directly.",
        href: "https://github.com/ngeorge15/ai-calorie-counter/blob/main/mobile/NOTES.md",
        hrefLabel: "mobile/NOTES.md",
      },
      {
        title: "A free GPU that PyTorch refuses to run on",
        body:
          "Kaggle's free-tier pool kept assigning a Tesla P100 — compute capability 6.0 — " +
          "while the default image's PyTorch build only targets 7.0 and up. The GPU is " +
          "present and visible, and every CUDA operation fails with 'no kernel image is " +
          "available for execution on the device.' Retrying just gets another P100. The fix " +
          "was pinning a CUDA 11.8-era build that still targets Pascal, which then needed " +
          "numpy pinned below 2.0 to match that torch version's ABI.",
        href: "https://github.com/ngeorge15/ai-calorie-counter/blob/main/model-training/NOTES.md",
        hrefLabel: "model-training/NOTES.md",
      },
      {
        title: "The UPC-A code type that correctly doesn't exist",
        body:
          "VisionCamera v5 exposes no upc-a scanner type, which looks like an omission and " +
          "isn't: a 12-digit UPC-A is an EAN-13 with a leading zero, so ean-13 already " +
          "covers US products. The padding difference gets reconciled server-side when " +
          "verifying a returned product against the scanned barcode.",
      },
    ],

    limitations: {
      title: "What this doesn't do yet",
      note:
        "Stated plainly because the alternative — implying more than has been measured — " +
        "is the thing that makes a portfolio project fall apart under one follow-up question.",
      items: [
        "The classifier has not been validated on real phone photos. 85.78% is Food-101's test split, shot and curated for a dataset, not a plate photographed in a dim kitchen.",
        "Portion estimation is unsolved, and it dominates total calorie error far more than food identification does. Getting the dish right and the quantity wrong still gives a wrong number.",
        "One dish per photo. Real meals have several things on the plate; multi-item detection is a segmentation problem, not a classification one, and it's scoped as a stretch goal.",
        "Android is unverified. Barcode scanning is confirmed on iOS only.",
        "The backend sleeps on the free tier, so the first request after idle is slow.",
      ],
    },

    links: [
      {
        label: "Repository",
        href: "https://github.com/ngeorge15/ai-calorie-counter",
      },
      {
        label: "Evaluation methodology",
        href: "https://github.com/ngeorge15/ai-calorie-counter/blob/main/benchmarks/classifier/METHODOLOGY.md",
        note: "written before the numbers existed",
      },
      {
        label: "Sync engine",
        href: "https://github.com/ngeorge15/ai-calorie-counter/blob/main/mobile/src/sync/engine.ts",
      },
      {
        label: "Roadmap",
        href: "https://github.com/ngeorge15/ai-calorie-counter/blob/main/ROADMAP.md",
      },
    ],
  },
};
