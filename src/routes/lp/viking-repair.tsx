import { createFileRoute } from "@tanstack/react-router";
import { BrandLanding, type BrandLandingConfig } from "@/components/site/BrandLanding";
import { absUrl, twitterMeta } from "@/lib/seo";

// Brand-specific paid-traffic landing page (noindex; see BrandLanding.tsx).
const CONFIG: BrandLandingConfig = {
  brand: "Viking",
  heroImage: "/images/services/range-stove-repair.webp",
  heroImageAlt: "Professional-style gas range with stainless steel cooktop in a Charlotte kitchen",
  heroLead:
    "Viking range, oven, cooktop or refrigerator acting up? Upfront pricing, OEM parts and a technician who explains the real problem.",
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
    title: "Ranges, ovens & cooktops",
    items: [
      "Burner won't light or clicks nonstop",
      "Oven not heating or heating unevenly",
      "Igniter, spark module or safety valve faults",
      "Temperature off / won't hold set temp",
      "Convection fan not running",
      "Control board and display errors",
    ],
  },
  fixesRight: {
    title: "Refrigeration & more",
    items: [
      "Viking refrigerator or freezer not cooling",
      "Ice maker not working or leaking",
      "Wine cooler not holding temperature",
      "Warming drawer not heating",
      "Range hood fan or light faults",
      "Door, hinge and seal problems",
    ],
  },
  steps: [
    {
      title: "Call or book online",
      body: "Tell us what's wrong and your Viking's model or error code — we'll get you on the schedule.",
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
      body: "Insured & certified technicians who've seen almost every Viking failure there is.",
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
      body: "Dinner party or a warm fridge? Call early for same-day availability; most repairs done in one visit.",
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
      src: "/images/projects/viking-range-repair-1.webp",
      alt: "Viking range repair in a Charlotte home",
      caption: "Viking range repair",
    },
    {
      src: "/images/projects/viking-range-repair-2.webp",
      alt: "Viking oven repair in Charlotte",
      caption: "Viking oven repair",
    },
    {
      src: "/images/projects/viking-wine-cooler-repair-1.webp",
      alt: "Viking wine cooler repair in Charlotte",
      caption: "Viking wine cooler",
    },
  ],
  alsoServiced: [
    "Sub-Zero",
    "Wolf",
    "Thermador",
    "Bertazzoni",
    "Dacor",
    "Blue Star",
    "GE Monogram",
    "Bosch",
    "Miele",
    "Fisher & Paykel",
  ],
  faqs: [
    {
      q: "How much is the diagnostic fee?",
      a: "$95, and it's waived when you complete the repair with us — you only pay for the fix.",
    },
    {
      q: "Do you offer same-day Viking repair?",
      a: "Often, yes — same-day service depends on technician availability that day, so call early for the best chance.",
    },
    {
      q: "Which Viking appliances do you repair?",
      a: "Gas, electric and dual-fuel ranges, wall ovens, cooktops, range hoods, warming drawers, refrigerators, freezers, ice makers and wine coolers.",
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
      q: "Is it worth repairing my Viking or should I replace it?",
      a: "We'll tell you honestly. After diagnosis you get an upfront repair quote, and if the repair doesn't make financial sense for your unit's age and condition, we'll say so.",
    },
    {
      q: "Do you install new appliances?",
      a: "No. We provide repair and maintenance only — we do not perform new appliance installations.",
    },
  ],
  finalHeading: "Get your Viking",
  finalAccent: "working again",
  finalBody:
    "Call now for same-day availability, or book your visit online. $95 diagnostic — waived when we complete the repair.",
};

export const Route = createFileRoute("/lp/viking-repair")({
  head: () => {
    const title = "Viking Repair Charlotte | Range, Oven & Fridge | $95 Diagnostic";
    const description =
      "13+ years repairing Viking ranges, ovens, cooktops and refrigerators in Charlotte. $95 diagnostic, waived on repair. Call now.";
    const image = absUrl("/images/services/range-stove-repair.webp");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absUrl("/lp/viking-repair") },
        { property: "og:image", content: image },
        ...twitterMeta(title, description, image),
      ],
      links: [{ rel: "canonical", href: absUrl("/lp/viking-repair") }],
    };
  },
  component: () => <BrandLanding config={CONFIG} />,
});
