import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Phone,
  CheckCircle2,
  Award,
  BadgeCheck,
  Star,
  Clock,
  MapPin,
  ExternalLink,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { GuaranteeBadge } from "@/components/site/GuaranteeBadge";
import { getSiteSettings } from "@/lib/site.functions";
import {
  DiagnosticsIcon,
  PricingIcon,
  SameDayIcon,
  WarrantyIcon,
} from "@/components/site/icons/WhyChooseIcons";
import { GoogleIcon } from "@/components/site/BrandIcons";
import { VenmoIcon, ZelleIcon } from "@/components/site/icons/PaymentIcons";
import { BOOKING_URL, GOOGLE_PROFILE_URL, WORK_MAP_EMBED_URL, WORK_MAP_URL } from "@/lib/site-data";

// Shared template for the brand-specific paid-traffic landing pages
// (/lp/sub-zero-repair, /lp/viking-repair, /lp/wolf-repair). Each route only
// supplies a BrandLandingConfig; layout, tracking-relevant tel: links and the
// booking CTA live here so the three pages stay consistent. Like the other
// /lp/ pages it renders without site nav/footer (see __root.tsx).

export type BrandLandingConfig = {
  /** Display name, e.g. "Sub-Zero". */
  brand: string;
  heroImage: string;
  heroImageAlt: string;
  heroLead: string;
  /** Short line under the CTA buttons, brand-specific urgency. */
  sameDayNote: string;
  stats: { value: string; label: string }[];
  /** Two columns of "what we fix". */
  fixesLeft: { title: string; items: string[] };
  fixesRight: { title: string; items: string[] };
  steps: { title: string; body: string }[];
  advantages: { title: string; body: string }[];
  /** Real job photos for this brand only; omit when none exist. */
  gallery?: { src: string; alt: string; caption: string }[];
  /** Other brands/lines serviced, shown as badges. */
  alsoServiced: string[];
  faqs: { q: string; a: string }[];
  /** Plain part of the closing heading; finalAccent is rendered highlighted after it. */
  finalHeading: string;
  finalAccent: string;
  finalBody: string;
};

const PATCH_URL =
  "https://patch.com/north-carolina/charlotte/business/listing/598721/best-sub-zero-viking-service?utm_source=badge&utm_medium=referral&utm_campaign=business_badge";

const PAYMENTS = [
  "Cash",
  "Credit cards",
  "Zelle",
  "Venmo",
  "Checks",
  "Invoices for regular clients",
];

const AREAS = [
  "Charlotte",
  "Myers Park",
  "Matthews",
  "SouthPark",
  "Ballantyne",
  "Mint Hill",
  "Huntersville",
  "Lake Norman",
];

const ADVANTAGE_ICONS = [
  Award,
  DiagnosticsIcon,
  PricingIcon,
  SameDayIcon,
  WarrantyIcon,
  BadgeCheck,
];

export function BrandLanding({ config }: { config: BrandLandingConfig }) {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
  });
  const phone = settings?.phone ?? "+1 (888) 988-8790";
  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const rating = settings?.review_rating;
  const reviewCount = settings?.review_count;
  const googleUrl = settings?.social_links?.google_reviews ?? GOOGLE_PROFILE_URL;
  const { brand } = config;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Slim top bar — logo + click-to-call only, no nav menu. */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo.webp"
              alt="Best Sub-Zero & Viking Service"
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            />
            <span className="font-display text-sm font-bold leading-tight sm:text-base">
              Best Sub-Zero &amp; Viking Service
            </span>
          </Link>
          <a href={telHref}>
            <Button size="sm" className="gap-2">
              <Phone className="h-4 w-4" /> {phone}
            </Button>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate flex min-h-[480px] items-center overflow-hidden border-b border-border md:min-h-[540px]">
        <ImagePlaceholder
          fill
          src={config.heroImage}
          label={`${brand} repair Charlotte`}
          alt={config.heroImageAlt}
          priority
          className="-z-10"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/10 md:from-black/75 md:via-black/35 md:to-transparent"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-black/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              Charlotte · Open 24 hours · Same-day service
            </span>
            <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] md:text-5xl">
              {brand} <span className="text-accent">Repair</span> in Charlotte
            </h1>
            <p className="mt-5 max-w-xl text-base text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] md:text-lg">
              {config.heroLead}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-3 rounded-lg border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-sm">
                <Award className="h-7 w-7 text-accent" aria-hidden />
                <div>
                  <p className="text-lg font-bold leading-none text-white">13+ Years</p>
                  <p className="mt-1 text-xs text-white/70">of hands-on experience</p>
                </div>
              </div>
              <a
                href={googleUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-3 rounded-lg border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-sm"
              >
                {rating ? (
                  <Star className="h-7 w-7 fill-accent text-accent" aria-hidden />
                ) : (
                  <GoogleIcon className="h-7 w-7" />
                )}
                <div>
                  <p className="text-lg font-bold leading-none text-white">
                    {rating ? `${rating.toFixed(1)}★ Rating` : "Google Business"}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
                    {rating ? <GoogleIcon className="h-3 w-3" /> : null}
                    {rating
                      ? reviewCount
                        ? `${reviewCount} Google reviews`
                        : "Google reviews"
                      : "Verified profile"}
                  </p>
                </div>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={telHref}>
                <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
                  <Phone className="h-4 w-4" /> Call {phone}
                </Button>
              </a>
              <a href={BOOKING_URL}>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Book Online
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
              $95 diagnostic fee —{" "}
              <span className="font-medium">waived when the repair is completed</span>.{" "}
              {config.sameDayNote}
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {config.stats.map((st) => (
            <div key={st.label} className="rounded-lg border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-accent">{st.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST ROW */}
      <section className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <GuaranteeBadge />
          <a href={PATCH_URL} target="_blank" rel="noreferrer noopener">
            <img
              src="https://patch.com/api_v1/bizpost/598721/badge"
              alt="Best Sub-Zero & Viking Service on Patch"
              loading="lazy"
              className="h-24 w-auto"
            />
          </a>
        </div>
      </section>

      {/* GOOGLE PROFILE */}
      {googleUrl ? (
        <section className="mx-auto max-w-3xl px-4 pt-10 md:px-8">
          <a
            href={googleUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center transition-colors hover:border-accent sm:flex-row sm:text-left"
          >
            <GoogleIcon className="h-10 w-10 flex-shrink-0" />
            <div className="flex-1">
              {rating ? (
                <p className="flex items-center justify-center gap-2 text-lg font-bold sm:justify-start">
                  {rating.toFixed(1)}
                  <span className="flex" aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </span>
                </p>
              ) : null}
              <p className="text-sm text-muted-foreground">
                {reviewCount
                  ? `Based on ${reviewCount} reviews from Charlotte customers on Google`
                  : "Find Best Sub-Zero & Viking Service on Google — verified business profile, hours and contacts"}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
              {reviewCount ? "Read our Google reviews" : "View our Google profile"}{" "}
              <ExternalLink className="h-4 w-4" aria-hidden />
            </span>
          </a>
        </section>
      ) : null}

      {/* WHY CHOOSE US */}
      <section className="mt-10 border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
            Why Charlotte homeowners choose us for <span className="text-accent">{brand}</span>
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {config.advantages.map((a, i) => {
              const Icon = ADVANTAGE_ICONS[i % ADVANTAGE_ICONS.length];
              return (
                <div key={a.title} className="rounded-lg border border-border bg-card p-5">
                  <Icon className="h-8 w-8 text-accent" aria-hidden />
                  <h3 className="mt-3 text-base font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
          How it <span className="text-accent">works</span>
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {config.steps.map((s, i) => (
            <div key={s.title} className="rounded-lg border border-border bg-card p-6">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Step {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT WE FIX */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
            {brand} problems we <span className="text-accent">fix</span>
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {[config.fixesLeft, config.fixesRight].map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {col.title}
                </h3>
                <div className="mt-4 space-y-2">
                  {col.items.map((f) => (
                    <div
                      key={f}
                      className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 text-sm"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent"
                        aria-hidden
                      />{" "}
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT WORK */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
          {config.gallery?.length ? "Real repairs in " : "Repairs across "}
          <span className="text-accent">Charlotte homes</span>
        </h2>
        {config.gallery?.length ? (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {config.gallery.map((g) => (
              <figure key={g.src} className="overflow-hidden rounded-lg border border-border">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <figcaption className="bg-card p-2 text-center text-xs text-muted-foreground">
                  {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
        <div className="mt-6 text-center">
          <a
            href={WORK_MAP_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
          >
            <MapPin className="h-4 w-4" aria-hidden /> See our completed jobs on the map
          </a>
        </div>
      </section>

      {/* ALSO SERVICED */}
      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          We also service
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {config.alsoServiced.map((b) => (
            <Badge key={b} variant="secondary" className="font-normal">
              {b}
            </Badge>
          ))}
        </div>
      </section>

      {/* HOURS + PAYMENT */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-3 md:px-8">
          <div className="rounded-lg border border-border bg-card p-5">
            <Clock className="h-6 w-6 text-accent" aria-hidden />
            <h3 className="mt-3 text-base font-semibold">Open 24 hours</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We accept requests around the clock — day, night and weekends.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <CalendarCheck className="h-6 w-6 text-accent" aria-hidden />
            <h3 className="mt-3 text-base font-semibold">Book anytime</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Our online booking form works 24/7 — pick your visit time in a minute.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-accent" aria-hidden>
              <ZelleIcon className="h-6 w-auto" />
              <VenmoIcon className="h-6 w-auto" />
            </div>
            <h3 className="mt-3 text-base font-semibold">Easy payment</h3>
            <p className="mt-1 text-sm text-muted-foreground">{PAYMENTS.join(" · ")}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="mx-auto max-w-2xl px-4 py-14 md:px-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
            Common <span className="text-accent">questions</span>
          </h2>
          <Accordion type="single" collapsible className="mt-8 w-full">
            {config.faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* SERVICE AREA + COMPLETED JOBS MAP */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Serving Charlotte <span className="text-accent">homes</span>
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                We're based in Charlotte and cover Myers Park, Matthews, SouthPark, Ballantyne, Mint
                Hill, Huntersville and Lake Norman. Every pin on the map is a job we've completed.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
                {AREAS.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden /> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-[420px] overflow-hidden rounded-lg border border-border md:h-[560px]">
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
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {config.finalHeading} <span className="text-accent">{config.finalAccent}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/75">{config.finalBody}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={telHref}>
              <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
                <Phone className="h-4 w-4" /> Call {phone}
              </Button>
            </a>
            <a href={BOOKING_URL}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Book Online
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground md:px-8">
          © {new Date().getFullYear()} Best Sub-Zero &amp; Viking Service. Independent appliance
          repair service. Not affiliated with the manufacturers of the brands listed above.
        </div>
      </footer>

      {/* Sticky mobile CTA bar (the site-wide one is suppressed on /lp/ routes). */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-background p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] md:hidden">
        <a href={telHref} className="flex-1">
          <Button size="lg" className="w-full gap-2">
            <Phone className="h-4 w-4" /> Call Now
          </Button>
        </a>
        <a href={BOOKING_URL} className="flex-1">
          <Button size="lg" variant="outline" className="w-full">
            Book Online
          </Button>
        </a>
      </div>
    </div>
  );
}
