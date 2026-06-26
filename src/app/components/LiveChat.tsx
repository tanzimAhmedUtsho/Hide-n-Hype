import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function LiveChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-3 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[calc(100vw-40px)] max-w-sm rounded-[8px] border border-border bg-[#0d0d0d] p-5 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span
                  className="text-accent tracking-widest uppercase block mb-1"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700 }}
                >
                  Live Chat
                </span>
                <h2
                  className="text-foreground"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "28px", fontWeight: 800 }}
                >
                  HIDE N HYPE SUPPORT
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close live chat"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mb-4 rounded-[8px] bg-card p-4">
              <p
                className="text-muted-foreground"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", lineHeight: "1.7" }}
              >
                Welcome to Hide n Hype. Drop your message and our Finland or Bangladesh team will
                get back to you.
              </p>
            </div>

            <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-[8px] bg-input px-4 py-3 text-foreground outline-none ring-1 ring-border transition-all focus:ring-accent"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px" }}
              />
              <textarea
                rows={3}
                placeholder="Write a message"
                className="w-full resize-none rounded-[8px] bg-input px-4 py-3 text-foreground outline-none ring-1 ring-border transition-all focus:ring-accent"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", lineHeight: "1.7" }}
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-[8px] bg-accent px-5 py-3 text-accent-foreground transition-colors hover:bg-foreground"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em" }}
              >
                SEND CHAT <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Open live chat"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-2xl transition-transform hover:-translate-y-1"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
      </button>
    </div>
  );
}
