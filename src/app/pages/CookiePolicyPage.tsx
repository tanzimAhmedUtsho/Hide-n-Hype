import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function CookiePolicyPage() {
  return (
    <main className="px-6 pb-20 pt-28 md:px-16 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.38em] text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Privacy / Cookies</span>
        <h1 className="mb-7 text-foreground leading-[0.9]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(48px, 8vw, 88px)", fontWeight: 800, letterSpacing: "-0.025em" }}>COOKIE POLICY<span className="text-accent">.</span></h1>
        <p className="mb-12 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Hide n Hype uses essential browser storage to remember your cookie choice. If you allow analytics, Google Analytics loads to measure website visits and page views. Advertising storage and ad personalization remain disabled in our Google consent settings.</p>

        <div className="divide-y divide-white/10 border-y border-white/10">
          <section className="grid gap-3 py-7 sm:grid-cols-[180px_1fr] sm:gap-8">
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Essential storage</h2>
            <p className="text-sm leading-7 text-muted-foreground">We use browser local storage to remember whether you allow or reject optional analytics. This preference storage is needed to respect your choice on later visits. It does not send your preference to an advertising platform.</p>
          </section>
          <section className="grid gap-3 py-7 sm:grid-cols-[180px_1fr] sm:gap-8">
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Google Analytics</h2>
            <p className="text-sm leading-7 text-muted-foreground">If you allow analytics, we load Google Analytics 4 to measure page views and general site use. Google Analytics may use cookies or similar identifiers and process information such as page URL, browser/device details, and interactions. The tag does not load when you reject optional analytics. Learn more in <a className="text-accent underline underline-offset-4" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google’s privacy information</a>.</p>
          </section>
          <section className="grid gap-3 py-7 sm:grid-cols-[180px_1fr] sm:gap-8">
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Change your choice</h2>
            <div>
              <p className="mb-4 text-sm leading-7 text-muted-foreground">You can change or withdraw your analytics choice at any time using Cookie Settings in the footer. You can also clear your browser’s site data to remove the saved preference.</p>
              <button onClick={() => window.dispatchEvent(new Event("hnh:open-cookie-settings"))} className="inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground transition hover:brightness-110" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Cookie Settings <ArrowRight size={14} /></button>
            </div>
          </section>
        </div>
        <p className="mt-7 text-xs text-muted-foreground">Updated 17 November 2026 · Read our <Link to="/privacy-policy" className="text-accent underline underline-offset-4">Privacy Policy</Link>.</p>
      </div>
    </main>
  );
}
