import { createFileRoute } from "@tanstack/react-router";
import { BrandLanding, type BrandLandingConfig } from "@/components/site/BrandLanding";
import { absUrl, twitterMeta } from "@/lib/seo";

// Brand-specific paid-traffic landing page (noindex; see BrandLanding.tsx).
const CONFIG: BrandLandingConfig = {
  brand: "Sub-Zero",
  heroImage: "/images/services/refrigerator-freezer-repair.webp",
  heroImageAlt: "Built-in refrigerator and wine column in a modern kitchen",
  heroLead:
    "Sub-Zero not cooling, leaking or showing an error? Upfront pricing, OEM parts and a technician who explains the real problem.",
  sameDayNote: "Food at risk? Call early for same-day service.",
  stats: [
    {
      value: "13+",
      label: "Years of experience",
    },
    {
      value: "3",
      label: "Specialty brands: Sub-Zero, Viking, Wolf",
    },
    {
      value: "$95",
      label: "Diagnostic, waived on repair",
    },
    {
      value: "6 mo",
      label: "Max warranty on parts & labor",
    },
  ],
  fixesLeft: {
    title: "Cooling & temperature issues",
    items: [
      "Refrigerator or freezer not cooling",
      "Temperature too warm or fluctuating",
      "Compressor or sealed system problems",
      "Evaporator and condenser fan failures",
      "Frost build-up and defrost faults",
      "Freezer cold but refrigerator warm",
    ],
  },
  fixesRight: {
    title: "Ice, water & components",
    items: [
      "Ice maker not making or dispensing ice",
      "Water leaking inside or onto the floor",
      "Water filter and inlet valve issues",
      "Control board, display and error codes",
      "Door seals, gaskets and hinges",
      "Noisy fans or unusual sounds",
    ],
  },
  steps: [
    {
      title: "Call or book online",
      body: "Tell us what's wrong and your Sub-Zero's model or error code — we'll get you on the schedule.",
    },
    {
      title: "On-site diagnosis",
      body: "A certified technician inspects the unit and identifies the actual cause.",
    },
    {
      title: "Upfront price, no surprises",
      body: "We explain what's wrong and quote the repair before touching a single part.",
    },
    {
      title: "Repair, same visit",
      body: "Most repairs are completed on the spot using OEM or manufacturer-approved parts.",
    },
  ],
  advantages: [
    {
      title: "13+ Years Experience",
      body: "Insured & certified technicians who've seen almost every Sub-Zero failure there is.",
    },
    {
      title: "Accurate Diagnostics",
      body: "We find the real fault before quoting — no guesswork, no unnecessary parts.",
    },
    {
      title: "Transparent Pricing",
      body: "$95 diagnostic fee, waived when you complete the repair with us. No surprise charges.",
    },
    {
      title: "Same-Day Service",
      body: "Spoiling food can't wait — call early for same-day availability; most repairs done in one visit.",
    },
    {
      title: "Warranty on All Work",
      body: "Labor and parts covered by warranty for 90 days to 6 months, depending on the repair.",
    },
    {
      title: "OEM Parts",
      body: "We use OEM or manufacturer-approved parts whenever available — not generic substitutes.",
    },
  ],
  gallery: [
    {
      src: "/images/projects/subzero-built-in-refrigerator-repair-1.webp",
      alt: "Sub-Zero built-in refrigerator and freezer repair in Charlotte",
      caption: "Sub-Zero built-in fridge & freezer",
    },
    {
      src: "/images/projects/subzero-side-by-side-refrigerator-repair-1.webp",
      alt: "Sub-Zero side-by-side refrigerator repair in Charlotte",
      caption: "Sub-Zero side-by-side",
    },
    {
      src: "/images/projects/subzero-built-in-refrigerator-repair-3.webp",
      alt: "Sub-Zero built-in refrigerator service in a Charlotte home",
      caption: "Sub-Zero built-in service",
    },
  ],
  alsoServiced: [
    "Viking",
    "Wolf",
    "Thermador",
    "Miele",
    "Fisher & Paykel",
    "Dacor",
    "JennAir",
    "Monogram",
    "Bosch",
    "KitchenAid",
    "Marvel",
    "U-Line",
  ],
  faqs: [
    {
      q: "How much is the diagnostic fee?",
      a: "$95, and it's waived when you complete the repair with us — you only pay for the fix.",
    },
    {
      q: "Do you offer same-day Sub-Zero repair?",
      a: "Often, yes — same-day service depends on technician availability that day, so call early for the best chance.",
    },
    {
      q: "Which Sub-Zero appliances do you repair?",
      a: "Built-in, integrated, over-and-under, side-by-side, French door, column and undercounter refrigerators, freezers, wine storage and ice makers.",
    },
    {
      q: "Do you use original manufacturer parts?",
      a: "We use OEM or manufacturer-approved parts whenever available, not generic substitutes.",
    },
    {
      q: "Is the repair covered by a warranty?",
      a: "Yes. Labor and parts are covered by warranty for 90 days to 6 months, depending on the repair.",
    },
    {
      q: "Is it worth repairing my Sub-Zero or should I replace it?",
      a: "We'll tell you honestly. After diagnosis you get an upfront repair quote, and if the repair doesn't make financial sense for your unit's age and condition, we'll say so.",
    },
    {
      q: "Do you install new appliances?",
      a: "No. We provide repair and maintenance only — we do not perform new appliance installations.",
    },
  ],
  finalHeading: "Get your Sub-Zero",
  finalAccent: "cooling again",
  finalBody:
    "Call now for same-day availability, or book your visit online. $95 diagnostic — waived when we complete the repair.",
};

export const Route = createFileRoute("/lp/sub-zero-repair")({
  head: () => {
    const title = "Sub-Zero Repair Charlotte | Same-Day Service | $95 Diagnostic";
    const description =
      "13+ years repairing Sub-Zero refrigerators, freezers and ice makers in Charlotte. $95 diagnostic, waived on repair. Call now.";
    const image = absUrl("/images/services/refrigerator-freezer-repair.webp");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absUrl("/lp/sub-zero-repair") },
        { property: "og:image", content: image },
        ...twitterMeta(title, description, image),
      ],
      links: [{ rel: "canonical", href: absUrl("/lp/sub-zero-repair") }],
    };
  },
  component: () => <BrandLanding config={CONFIG} />,
});
