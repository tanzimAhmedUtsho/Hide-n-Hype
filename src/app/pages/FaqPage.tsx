import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

const faqGroups = [
  {
    title: "Products & orders",
    eyebrow: "01 / SHOPPING",
    questions: [
      {
        question: "How do I place an order?",
        answer: "Online checkout is not available yet. Browse the collection and contact our team with the product you are interested in; we will help with the next steps.",
      },
      {
        question: "Can I confirm sizes, colors, and availability?",
        answer: "Yes. Product imagery and color swatches are visual references. Contact us with the product name so we can confirm current size, color, and availability details.",
      },
      {
        question: "How do shipping and returns work?",
        answer: "Shipping arrangements and return terms can vary by order and destination. Please contact us to confirm the current terms before placing an order.",
      },
    ],
  },
  {
    title: "Sourcing & manufacturing",
    eyebrow: "02 / BUSINESS",
    questions: [
      {
        question: "What is the minimum order quantity (MOQ)?",
        answer: "Our current guide is 500 pieces per style for both basic apparel and activewear. Custom production quantities can be discussed for your program.",
      },
      {
        question: "What are the sampling and production lead times?",
        answer: "As a guide, sampling takes 7–14 days and production takes 30–60 days. Actual timing depends on the product, order volume, customization, and production schedule; shipment timing depends on destination.",
      },
      {
        question: "Can you support private label, OEM, or ODM production?",
        answer: "Yes. We support product development, sampling, bulk production, private label manufacturing, OEM/ODM services, quality control, and packaging coordination.",
      },
      {
        question: "Which factory certifications are available?",
        answer: "Certification availability varies by manufacturing partner and production program. Ask us for current documentation relevant to the factory and order you are considering.",
      },
    ],
  },
];

export function FaqPage() {
  return (
    <main className="px-6 pb-20 pt-28 md:px-16 md:pt-36">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 border-b border-border/30 pb-8 md:mb-16 md:pb-10">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.38em] text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            HELP / FAQ
          </span>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h1 className="text-foreground leading-[0.9]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 800, letterSpacing: "-0.025em" }}>
              GOOD TO KNOW.
            </h1>
            <p className="max-w-md text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", lineHeight: 1.75 }}>
              Quick answers about shopping, product details, and working with Hide n Hype.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-5xl space-y-12 md:space-y-16">
          {faqGroups.map((group) => (
            <section key={group.eyebrow} className="grid gap-5 md:grid-cols-[0.72fr_1.28fr] md:gap-12">
              <div>
                <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.25em] text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {group.eyebrow}
                </span>
                <h2 className="text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 700, lineHeight: 1 }}>
                  {group.title}
                </h2>
              </div>
              <Accordion type="single" collapsible className="border-t border-border/40">
                {group.questions.map((item, index) => (
                  <AccordionItem key={item.question} value={`${group.eyebrow}-${index}`} className="border-border/40">
                    <AccordionTrigger className="py-5 text-base text-foreground hover:no-underline md:text-[17px]">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="max-w-2xl pb-5 text-sm leading-7 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        <div className="mx-auto mt-16 flex max-w-5xl flex-col justify-between gap-5 rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:mt-20 md:flex-row md:items-center md:p-8">
          <div>
            <h2 className="text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "28px", fontWeight: 700 }}>Still have a question?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Send our team a note and we’ll help you find the right answer.</p>
          </div>
          <Link to="/contact" className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-bold tracking-[0.12em] text-accent-foreground transition-colors hover:bg-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            CONTACT US <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
