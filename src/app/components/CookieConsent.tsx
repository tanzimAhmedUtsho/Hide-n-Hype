import { useEffect, useState } from "react";
import { Check, Cookie, Settings2, X } from "lucide-react";
import { getPrivacyConsent, initializeAnalyticsConsent, saveAnalyticsConsent } from "../analytics";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    initializeAnalyticsConsent();
    const consent = getPrivacyConsent();
    setAnalyticsEnabled(Boolean(consent?.analytics));
    setVisible(!consent);

    const openSettings = () => {
      const saved = getPrivacyConsent();
      setAnalyticsEnabled(Boolean(saved?.analytics));
      setSettingsOpen(true);
      setVisible(true);
    };
    window.addEventListener("hnh:open-cookie-settings", openSettings);
    return () => window.removeEventListener("hnh:open-cookie-settings", openSettings);
  }, []);

  function chooseAnalytics(allowed: boolean) {
    saveAnalyticsConsent(allowed);
    setAnalyticsEnabled(allowed);
    setVisible(false);
    setSettingsOpen(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-xl border border-white/15 bg-[#101010]/95 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl md:inset-x-8 md:bottom-8 md:p-6"
      role="dialog"
      aria-modal="false"
    >
      <div className="flex items-start gap-4">
        <div className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent sm:flex">
          <Cookie size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.24em] text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Your privacy, your choice
              </span>
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Cookie preferences
              </h2>
            </div>
            <button aria-label="Close cookie preferences" onClick={() => setVisible(false)} className="rounded p-1 text-muted-foreground transition hover:text-foreground">
              <X size={17} />
            </button>
          </div>

          <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm">
            Essential storage keeps your choice. With your permission, Google Analytics measures visits and site use so we can understand performance. Analytics stays off unless you allow it. You can change your choice any time in Cookie Settings.
          </p>

          {settingsOpen && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Google Analytics</p>
                <p className="text-xs leading-5 text-muted-foreground">Optional measurement cookies and page-view events.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={analyticsEnabled}
                onClick={() => setAnalyticsEnabled((enabled) => !enabled)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${analyticsEnabled ? "bg-accent" : "bg-white/20"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${analyticsEnabled ? "left-6" : "left-1"}`} />
              </button>
            </div>
          )}

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <a href="/cookie-policy" className="inline-flex items-center gap-1.5 self-start text-xs text-muted-foreground underline decoration-white/20 underline-offset-4 transition hover:text-foreground">
              Cookie Policy <Settings2 size={13} />
            </a>
            <div className="flex flex-col gap-2 sm:flex-row">
              {settingsOpen ? (
                <button onClick={() => chooseAnalytics(analyticsEnabled)} className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground transition hover:brightness-110" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <Check size={14} /> Save preference
                </button>
              ) : (
                <>
                  <button onClick={() => { setAnalyticsEnabled(Boolean(getPrivacyConsent()?.analytics)); setSettingsOpen(true); }} className="rounded-md border border-white/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground transition hover:border-white/30" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Customize
                  </button>
                  <button onClick={() => chooseAnalytics(false)} className="rounded-md border border-white/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground transition hover:border-white/30" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Reject optional
                  </button>
                  <button onClick={() => chooseAnalytics(true)} className="rounded-md bg-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground transition hover:brightness-110" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Allow analytics
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
