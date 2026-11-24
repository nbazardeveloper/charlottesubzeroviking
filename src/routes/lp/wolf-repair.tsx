import { createFileRoute } from "@tanstack/react-router";
import { BrandLanding, type BrandLandingConfig } from "@/components/site/BrandLanding";
import { absUrl, twitterMeta } from "@/lib/seo";

// Brand-specific paid-traffic landing page (noindex; see BrandLanding.tsx).
const CONFIG: BrandLandingConfig = {
  brand: "Wolf",
  heroImage: "/images/services/oven-repair.webp",
  heroImageAlt: "Built-in double wall oven with the door open and a tray of roasted vegetables",
  heroLead:
    "Wolf range, oven or cooktop not performing? Upfront pricing, OEM parts and a technician who explains the real problem.",
  sameDayNote: "Call early for same-day availability.",
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
    title: "Ranges & cooktops",
    items: [
      "Burner won't ignite or won't stay lit",
      "Igniter, spark module or safety valve faults",
      "Gas or dual-fuel range not working properly",
      "Griddle or infrared charbroiler problems",
      "Induction cooktop errors",
      "Knob, control and display faults",
    ],
  },
  fixesRight: {
    title: "Ovens & components",
    items: [
      "Oven not heating or heating unevenly",
      "Temperature off / won't hold set temp",
      "Bake or broil element not working",
      "Convection fan not running",
      "Door won't close, seal or latch",
      "Control board, steam oven and error codes",
    ],
  },
  steps: [
    {
      title: "Call or book online",
      body: "Tell us what's wrong and your Wolf's model or error code — we'll get you on the schedule.",
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
      body: "Insured & certified technicians who've seen almost every Wolf failure there is.",
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
      body: "Need your oven back before dinner or a holiday? Call early for same-day availability; most repairs done in one visit.",
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
  alsoServiced: [
    "Sub-Zero",
    "Viking",
    "Thermador",
    "Bosch",
    "Dacor",
    "GE Monogram",
    "Bertazzoni",
    "Blue Star",
  ],
  faqs: [
    {
      q: "How much is the diagnostic fee?",
      a: "$95, and it's waived when you complete the repair with us — you only pay for the fix.",
    },
    {
      q: "Do you offer same-day Wolf repair?",
      a: "Often, yes — same-day service depends on technician availability that day, so call early for the best chance.",
    },
    {
      q: "Which Wolf appliances do you repair?",
      a: "Gas, dual-fuel and electric ranges, wall and double ovens, convection and steam ovens, cooktops, griddles and charbroilers.",
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
      q: "Is it worth repairing my Wolf or should I replace it?",
      a: "We'll tell you honestly. After diagnosis you get an upfront repair quote, and if the repair doesn't make financial sense for your unit's age and condition, we'll say so.",
    },
    {
      q: "Do you install new appliances?",
      a: "No. We provide repair and maintenance only — we do not perform new appliance installations.",
    },
  ],
  finalHeading: "Get your Wolf",
  finalAccent: "cooking again",
  finalBody:
    "Call now for same-day availability, or book your visit online. $95 diagnostic — waived when we complete the repair.",
};

export const Route = createFileRoute("/lp/wolf-repair")({
  head: () => {
    const title = "Wolf Repair Charlotte | Range, Oven & Cooktop | $95 Diagnostic";
    const description =
      "13+ years repairing Wolf ranges, ovens and cooktops in Charlotte. $95 diagnostic, waived on repair. Call now.";
    const image = absUrl("/images/services/oven-repair.webp");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absUrl("/lp/wolf-repair") },
        { property: "og:image", content: image },
        ...twitterMeta(title, description, image),
      ],
      links: [{ rel: "canonical", href: absUrl("/lp/wolf-repair") }],
    };
  },
  component: () => <BrandLanding config={CONFIG} />,
});
