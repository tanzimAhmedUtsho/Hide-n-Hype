import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { cmsTeamImage, loadCmsTeam, type CmsTeamMember } from "../cmsTeam";

export function TeamSection() {
  const [members, setMembers] = useState<CmsTeamMember[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    loadCmsTeam(controller.signal).then(setMembers).catch(() => setMembers([]));
    return () => controller.abort();
  }, []);

  if (!members.length) return null;

  return (
    <section className="border-y border-border/30 bg-card/15 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-16">
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.3em] text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>The people behind the work</span>
            <h2 className="text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, lineHeight: 0.95 }}>MEET OUR TEAM</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground md:text-base" style={{ fontFamily: "'Barlow', sans-serif" }}>
            A connected team bringing design, sourcing and production together across Finland and Bangladesh.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: Math.min(index, 4) * 0.07 }}
              className="group overflow-hidden border border-border/35 bg-background/60 transition-colors duration-300 hover:border-accent/50"
            >
              <div className="relative aspect-[4/4.3] overflow-hidden bg-card">
                {member.image ? (
                  <img src={cmsTeamImage(member.image)} alt={member.name} loading="lazy" className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(216,176,74,0.14),transparent_60%)] text-7xl font-bold text-accent/70" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {member.name.trim().charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-4 left-5 flex items-center gap-1.5 text-xs font-medium text-white/90" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  <MapPin size={13} className="text-accent" /> {member.location || "Hide n Hype"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 p-5 md:p-6">
                <div>
                  <h3 className="text-2xl font-bold leading-none text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{member.name}</h3>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{member.designation}</p>
                  {member.bio && <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{member.bio}</p>}
                </div>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-border/40 text-muted-foreground transition-colors group-hover:border-accent/40 group-hover:text-accent" aria-hidden="true"><ArrowUpRight size={15} /></span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
