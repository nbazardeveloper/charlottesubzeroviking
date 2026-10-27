import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { absUrl } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site.functions";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Where ProsBuddy redirects after a completed booking. Loading this page is
// the Google Ads "Submit lead form" conversion, so it's kept out of search
// results and the sitemap.
export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You | Best Sub-Zero & Viking Service Charlotte" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: absUrl("/thank-you") }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["site-settings"],
      queryFn: () => getSiteSettings(),
    }),
  component: ThankYou,
});

function ThankYou() {
  const { data: s } = useQuery({ queryKey: ["site-settings"], queryFn: () => getSiteSettings() });
  const phone = s?.phone ?? "+1 (888) 988-8790";
  const digits = phone.replace(/[^+\d]/g, "");

  // Fired from an effect rather than a <head> script so it also runs when
  // the page is reached by client-side navigation. The ref stops React
  // StrictMode's double effect run in dev from counting it twice.
  const reported = useRef(false);
  useEffect(() => {
    if (reported.current) return;
    reported.current = true;
    window.gtag?.("event", "conversion", {
      send_to: "AW-18538886791/bweaCLjIhqsdEIftg4hF",
      value: 1.0,
      currency: "USD",
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-8 md:py-28">
      <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
      <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
        Thank <span className="text-accent">you</span>
      </h1>
      <p className="mt-4 text-muted-foreground">
        Your service request has been received. We'll contact you shortly to confirm your
        appointment. Need help sooner? Give us a call.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href={`tel:${digits}`}>
          <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <Phone className="h-4 w-4" /> {phone}
          </Button>
        </a>
        <Link to="/">
          <Button size="lg" variant="outline">
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
