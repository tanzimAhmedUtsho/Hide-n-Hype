import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { customerAccountUrl, customerProfileChangedEvent, getCustomerAccount, type CustomerProfile } from "../customerAccount";

const divisions = ["Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"];
const emptyProfile = { name: "", phone: "", division: "Dhaka", district: "", postalCode: "", address: "" };
const inputClass = "w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c7a64b]";

export function CustomerProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [form, setForm] = useState(emptyProfile);
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getCustomerAccount().then(result => {
      if (active && result.profile) { setProfile(result.profile); setForm({ name: result.profile.name, phone: result.profile.phone, division: result.profile.division, district: result.profile.district, postalCode: result.profile.postalCode, address: result.profile.address }); }
    }).catch(() => { if (active) setError("Account service is unavailable. Please check that the CMS is running."); });
    return () => { active = false; };
  }, []);

  function setField(name: keyof typeof form, value: string) { setForm(current => ({ ...current, [name]: value })); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(customerAccountUrl, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, email, password, ...(mode === "register" ? form : {}) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not sign in.");
      setProfile(data.profile); setForm({ name: data.profile.name, phone: data.profile.phone, division: data.profile.division, district: data.profile.district, postalCode: data.profile.postalCode, address: data.profile.address }); setPassword("");
      window.dispatchEvent(new Event(customerProfileChangedEvent)); setMessage(mode === "register" ? "Your account has been created." : "You are signed in.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Something went wrong."); }
    finally { setBusy(false); }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(customerAccountUrl, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not save profile.");
      setProfile(data.profile); window.dispatchEvent(new Event(customerProfileChangedEvent)); setMessage("Profile saved.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save profile."); }
    finally { setBusy(false); }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(customerAccountUrl, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "change-password", currentPassword, newPassword }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not change password.");
      setCurrentPassword(""); setNewPassword(""); setMessage("Password changed.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not change password."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    await fetch(customerAccountUrl, { method: "DELETE", credentials: "include" }); setProfile(null); setForm(emptyProfile); setMode("login"); window.dispatchEvent(new Event(customerProfileChangedEvent)); setMessage("You are signed out.");
  }

  return <main className="min-h-screen bg-[#090909] px-5 pb-24 pt-32 text-[#f3f0e7] md:px-10">
    <div className="mx-auto max-w-5xl">
      <Link to="/" className="text-xs uppercase tracking-[0.2em] text-[#c7a64b]">Hide n Hype</Link>
      <div className="mb-8 mt-4 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#c7a64b]">Your account</p><h1 className="text-3xl font-semibold md:text-4xl">{profile ? "My profile" : mode === "register" ? "Create your profile" : "Welcome back"}</h1><p className="mt-2 text-sm text-white/55">Save your contact details and delivery address for future enquiries.</p></div>{profile && <button onClick={signOut} className="border border-white/20 px-4 py-2 text-sm hover:border-[#c7a64b]">Sign out</button>}</div>
      {(message || error) && <div role="status" className={`mb-5 border px-4 py-3 text-sm ${error ? "border-red-400/40 text-red-300" : "border-emerald-400/30 text-emerald-300"}`}>{error || message}</div>}
      {!profile ? <form onSubmit={submit} className="border border-white/10 bg-white/[0.025] p-5 md:p-8">
        <div className="mb-6 flex gap-5 border-b border-white/10 pb-4"><button type="button" onClick={() => { setMode("register"); setError(""); }} className={mode === "register" ? "text-[#d3b253]" : "text-white/50"}>Create account</button><button type="button" onClick={() => { setMode("login"); setError(""); }} className={mode === "login" ? "text-[#d3b253]" : "text-white/50"}>Sign in</button></div>
        {mode === "register" && <div className="mb-5 grid gap-5 md:grid-cols-2"><label className="text-sm text-white/75">Full name<input required minLength={2} maxLength={120} value={form.name} onChange={e => setField("name", e.target.value)} className={`${inputClass} mt-2`} autoComplete="name" /></label><label className="text-sm text-white/75">Phone / WhatsApp<input required value={form.phone} onChange={e => setField("phone", e.target.value)} className={`${inputClass} mt-2`} autoComplete="tel" /></label></div>}
        <div className="grid gap-5 md:grid-cols-2"><label className="text-sm text-white/75">Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={`${inputClass} mt-2`} autoComplete="email" /></label><label className="text-sm text-white/75">Password<input required type="password" minLength={mode === "register" ? 12 : 1} value={password} onChange={e => setPassword(e.target.value)} className={`${inputClass} mt-2`} autoComplete={mode === "register" ? "new-password" : "current-password"} />{mode === "register" && <span className="mt-1 block text-xs text-white/40">Use at least 12 characters.</span>}</label></div>
        {mode === "register" && <><div className="mt-5 grid gap-5 md:grid-cols-2"><label className="text-sm text-white/75">Division<select required value={form.division} onChange={e => setField("division", e.target.value)} className={`${inputClass} mt-2`}>{divisions.map(value => <option key={value} className="bg-[#111]">{value}</option>)}</select></label><label className="text-sm text-white/75">District<input required value={form.district} onChange={e => setField("district", e.target.value)} className={`${inputClass} mt-2`} autoComplete="address-level2" /></label><label className="text-sm text-white/75">Postal code <span className="text-white/40">(optional)</span><input value={form.postalCode} onChange={e => setField("postalCode", e.target.value)} className={`${inputClass} mt-2`} autoComplete="postal-code" /></label><label className="text-sm text-white/75 md:col-span-2">Full address<textarea required minLength={5} value={form.address} onChange={e => setField("address", e.target.value)} className={`${inputClass} mt-2 min-h-24 resize-y`} autoComplete="street-address" /></label></div></>}
        <button disabled={busy} className="mt-6 bg-[#c7a64b] px-6 py-3 text-sm font-semibold text-black disabled:opacity-50">{busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}</button>
      </form> : <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]"><form onSubmit={saveProfile} className="border border-white/10 bg-white/[0.025] p-5 md:p-8"><h2 className="mb-5 text-xl font-medium">Contact details & address</h2><label className="mb-5 block text-sm text-white/75">Email address<input readOnly value={profile.email} className={`${inputClass} mt-2 cursor-not-allowed text-white/50`} /></label><div className="grid gap-5 md:grid-cols-2"><label className="text-sm text-white/75">Full name<input required value={form.name} onChange={e => setField("name", e.target.value)} className={`${inputClass} mt-2`} /></label><label className="text-sm text-white/75">Phone / WhatsApp<input required value={form.phone} onChange={e => setField("phone", e.target.value)} className={`${inputClass} mt-2`} /></label><label className="text-sm text-white/75">Division<select required value={form.division} onChange={e => setField("division", e.target.value)} className={`${inputClass} mt-2`}>{divisions.map(value => <option key={value} className="bg-[#111]">{value}</option>)}</select></label><label className="text-sm text-white/75">District<input required value={form.district} onChange={e => setField("district", e.target.value)} className={`${inputClass} mt-2`} /></label><label className="text-sm text-white/75">Postal code <span className="text-white/40">(optional)</span><input value={form.postalCode} onChange={e => setField("postalCode", e.target.value)} className={`${inputClass} mt-2`} /></label><label className="text-sm text-white/75 md:col-span-2">Full address<textarea required value={form.address} onChange={e => setField("address", e.target.value)} className={`${inputClass} mt-2 min-h-24 resize-y`} /></label></div><button disabled={busy} className="mt-6 bg-[#c7a64b] px-6 py-3 text-sm font-semibold text-black disabled:opacity-50">Save profile</button></form>
      <form onSubmit={changePassword} className="h-fit border border-white/10 bg-white/[0.025] p-5 md:p-8"><h2 className="mb-5 text-xl font-medium">Change password</h2><label className="mb-5 block text-sm text-white/75">Current password<input required type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={`${inputClass} mt-2`} autoComplete="current-password" /></label><label className="block text-sm text-white/75">New password<input required type="password" minLength={12} value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`${inputClass} mt-2`} autoComplete="new-password" /><span className="mt-1 block text-xs text-white/40">Use at least 12 characters.</span></label><button disabled={busy} className="mt-6 border border-white/20 px-5 py-3 text-sm hover:border-[#c7a64b] disabled:opacity-50">Update password</button></form></div>}
    </div>
  </main>;
}
