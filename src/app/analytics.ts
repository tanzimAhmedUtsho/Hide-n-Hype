const GA_MEASUREMENT_ID = "G-SWDNSVV7ZM";
const CONSENT_STORAGE_KEY = "hnh-privacy-consent";

type PrivacyConsent = {
  analytics: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

let defaultsSet = false;
let googleTagConfigured = false;
let googleTagScriptAdded = false;

function getSavedConsent(): PrivacyConsent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PrivacyConsent>;
    return typeof parsed.analytics === "boolean"
      ? { analytics: parsed.analytics, updatedAt: String(parsed.updatedAt ?? "") }
      : null;
  } catch {
    return null;
  }
}

function ensureGtagQueue() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
}

export function getPrivacyConsent() {
  return getSavedConsent();
}

export function initializeAnalyticsConsent() {
  ensureGtagQueue();

  if (!defaultsSet) {
    window.gtag?.("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    defaultsSet = true;
  }

  const consent = getSavedConsent();
  if (consent?.analytics) {
    applyAnalyticsConsent(true);
  }
}

function applyAnalyticsConsent(allowed: boolean) {
  ensureGtagQueue();
  window.gtag?.("consent", "update", {
    analytics_storage: allowed ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (!allowed) return;

  if (!googleTagScriptAdded) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    googleTagScriptAdded = true;
  }

  if (!googleTagConfigured) {
    window.gtag?.("js", new Date());
    window.gtag?.("config", GA_MEASUREMENT_ID, { send_page_view: false });
    googleTagConfigured = true;
  }
}

export function saveAnalyticsConsent(allowed: boolean) {
  const consent = { analytics: allowed, updatedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // The current choice still applies for this page view if storage is unavailable.
  }
  applyAnalyticsConsent(allowed);
  return consent;
}

export function trackPageView(path: string, title: string) {
  initializeAnalyticsConsent();
  if (!getSavedConsent()?.analytics) return;

  window.gtag?.("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}
