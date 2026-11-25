import { Phone } from "lucide-react";
import { siteSettings } from "@/lib/site-data";

// Slim offer strip shown right under the landing-page header so the price and
// the promise are visible on the first mobile screen, before the hero photo.
export function OfferBar() {
  const phone = siteSettings.phone;
  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  return (
    <div className="bg-accent text-accent-foreground">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-sm font-semibold md:px-8">
        <span>$95 diagnostic — credited toward your repair</span>
        <span className="hidden sm:inline" aria-hidden>
          ·
        </span>
        <span>Same-day appointments</span>
        <a href={telHref} className="inline-flex items-center gap-1 underline underline-offset-2">
          <Phone className="h-3.5 w-3.5" aria-hidden /> Call now
        </a>
      </div>
    </div>
  );
}
