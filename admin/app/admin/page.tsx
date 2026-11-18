import { isAdmin } from "@/lib/auth";
import AdminApp from "@/components/AdminApp";

export const dynamic = "force-dynamic";
export default async function AdminPage() { const user = await isAdmin(); return <AdminApp authenticated={!!user} initialRole={user?.role ?? null} />; }
