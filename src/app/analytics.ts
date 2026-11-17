const GTM_CONTAINER_ID = "GTM-TF7XCN3C";
const CONSENT_STORAGE_KEY = "hnh-privacy-consent";

type PrivacyConsent = {
  analytics: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let gtmLoaded = false;
let consentDefaultsSet = false;

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

export function getPrivacyConsent() {
  return getSavedConsent();
}

function initializeConsentDefaults() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));

  if (consentDefaultsSet) return;
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  consentDefaultsSet = true;
}

function loadGoogleTagManager() {
  if (gtmLoaded) return;

  initializeConsentDefaults();
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);
  gtmLoaded = true;
}

export function initializeAnalyticsConsent() {
  initializeConsentDefaults();

  if (getSavedConsent()?.analytics) {
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    loadGoogleTagManager();
  }
}

function expireGoogleAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const hostname = window.location.hostname;
  const domain = hostname.split(".").length > 1 ? hostname.split(".").slice(-2).join(".") : hostname;

  for (const name of cookieNames) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}; SameSite=Lax`;
  }
}

export function saveAnalyticsConsent(allowed: boolean) {
  const previousConsent = getSavedConsent();
  const consent = { analytics: allowed, updatedAt: new Date().toISOString() };

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // The current page still honors this choice if browser storage is unavailable.
  }

  if (allowed) {
    initializeConsentDefaults();
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    loadGoogleTagManager();
  } else if (previousConsent?.analytics) {
    expireGoogleAnalyticsCookies();
    window.location.reload();
  }

  return consent;
}
