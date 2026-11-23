export type CmsTeamMember = {
  id: string;
  name: string;
  designation: string;
  location?: string;
  image?: string;
  bio?: string;
  sortOrder?: number;
};

const cmsApiBase = (import.meta.env.VITE_CMS_API_URL || "http://localhost:3000").replace(/\/+$/, "");

export async function loadCmsTeam(signal?: AbortSignal): Promise<CmsTeamMember[]> {
  const response = await fetch(`${cmsApiBase}/api/public/team`, { signal, cache: "no-store" });
  if (!response.ok) throw new Error("Could not load team members.");
  return response.json() as Promise<CmsTeamMember[]>;
}

export function cmsTeamImage(image?: string) {
  if (!image) return "";
  return image.startsWith("/") ? `${cmsApiBase}${image}` : image;
}
