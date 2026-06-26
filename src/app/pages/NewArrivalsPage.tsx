import { NewArrivals } from "../components/NewArrivals";
import { Newsletter } from "../components/Newsletter";

export function NewArrivalsPage() {
  return (
    <div className="pt-24">
      <div className="px-6 md:px-16 mb-8">
        <span
          className="text-accent tracking-[0.4em] uppercase block mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
        >
          SHOP NOW
        </span>
        <h1
          className="text-foreground leading-none"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900, letterSpacing: "-0.01em" }}
        >
          NEW ARRIVALS
        </h1>
      </div>
      <NewArrivals />
      {/*<Newsletter />*/}
    </div>
  );
}
