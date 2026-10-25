import { createFileRoute } from "@tanstack/react-router";
import { absUrl, DEFAULT_OG_IMAGE, twitterMeta } from "@/lib/seo";
import { MapPin } from "lucide-react";
import { FinalCta } from "@/components/site/FinalCta";
import { BOOKING_URL, WORK_MAP_URL, WORK_MAP_EMBED_URL } from "@/lib/site-data";

const AREAS = [
  {
    name: "Charlotte",
    blurb:
      "Our home base. We know Charlotte neighborhoods and can typically reach customers same day when schedules allow.",
  },
  {
    name: "Myers Park",
    blurb:
      "Regular routes throughout Myers Park, from historic homes to renovated kitchens with built-in Sub-Zero and Wolf.",
  },
  {
    name: "Matthews",
    blurb:
      "Coverage across Matthews for premium refrigeration, ranges and ovens in single-family and multi-family homes.",
  },
  {
    name: "SouthPark",
    blurb:
      "Frequent service across SouthPark's high-rise condos and established residential streets.",
  },
  {
    name: "Ballantyne",
    blurb: "Regular appointments in Ballantyne and surrounding south Charlotte communities.",
  },
  {
    name: "Mint Hill",
    blurb: "Serving Mint Hill homeowners for premium kitchen appliance repair and maintenance.",
  },
  {
    name: "Huntersville",
    blurb: "Serving Huntersville homeowners for repair and preventive maintenance.",
  },
  {
    name: "Lake Norman",
    blurb:
      "Broader coverage across Lake Norman — Cornelius, Davidson and Mooresville — for high-end residential appliances.",
  },
];

export const Route = createFileRoute("/service-area")({
  head: () => ({
    meta: [
      { title: "Service Area | Sub-Zero & Viking Repair in Charlotte" },
      {
        name: "description",
        content:
          "We repair premium kitchen appliances across Charlotte, Myers Park, Matthews, SouthPark, Ballantyne, Mint Hill and Lake Norman.",
      },
      { property: "og:title", content: "Service Area" },
      { property: "og:description", content: "Where we repair premium kitchen appliances." },
      { property: "og:url", content: absUrl("/service-area") },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      ...twitterMeta("Service Area", "Where we repair premium kitchen appliances."),
    ],
    links: [{ rel: "canonical", href: absUrl("/service-area") }],
  }),
  component: ServiceArea,
});

function ServiceArea() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Service <span className="text-accent">area</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            We serve homeowners across Charlotte and Lake Norman. Same-day service depends on
            technician availability — we'll tell you honestly when we can be there.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((a) => (
            <div key={a.name} className="rounded-lg border border-border bg-card p-6">
              <MapPin className="h-5 w-5 text-accent" aria-hidden />
              <h2 className="mt-4 text-lg font-semibold">{a.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{a.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Where we <span className="text-accent">work</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every pin on this map is a repair we've completed across Charlotte and the surrounding
            area.{" "}
            <a
              href={WORK_MAP_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent hover:underline"
            >
              Open the full map →
            </a>
          </p>
          <div className="mt-8 h-[420px] overflow-hidden rounded-lg border border-border md:h-[640px]">
            <iframe
              title="Map of our completed jobs in the Charlotte area"
              src={WORK_MAP_EMBED_URL}
              width="100%"
              height="100%"
              className="border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Not sure if we cover your address?{" "}
            <a href={BOOKING_URL} className="text-accent hover:underline">
              Send us a request
            </a>{" "}
            and we'll confirm.
          </p>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
