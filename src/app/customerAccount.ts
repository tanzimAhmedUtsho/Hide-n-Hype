export type CustomerProfile = {
  id: string;
  email: string;
  name: string;
  phone: string;
  division: string;
  district: string;
  postalCode: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
};

const apiBase = (import.meta.env.VITE_CMS_API_URL || "http://localhost:3000").replace(/\/+$/, "");
export const customerAccountUrl = `${apiBase}/api/public/account`;
export const customerProfileChangedEvent = "hnh-customer-profile-changed";

export async function getCustomerAccount() {
  const response = await fetch(customerAccountUrl, { credentials: "include", cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not load your account.");
  return data as { authenticated: boolean; profile?: CustomerProfile };
}
