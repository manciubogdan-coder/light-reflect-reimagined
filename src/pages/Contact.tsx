
import { useState } from "react";
import { Rocket, Atom, Zap } from "lucide-react";
import ElectricText from "../components/ElectricText";

const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center py-24 hologram">
      {/* Fundal cu linii și particule */}
      <div className="absolute inset-0 bg-circuit-pattern bg-cover bg-center opacity-20 z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-dark-matter/80 via-hologram-blue/10 to-electric-blue/10 z-0" />

      <div className="relative z-10 max-w-xl w-full tech-panel shadow-xl animate-float">
        <ElectricText text="Contact Futurist" className="text-3xl md:text-4xl font-tech mb-6 text-hologram-blue" />
        <p className="text-white/70 mb-8 font-future text-lg text-center">
          Trimite-ne un mesaj și vei primi răspunsul direct din viitor ⚡
        </p>
        {sent ? (
          <div className="flex flex-col items-center gap-3">
            <Zap className="w-12 h-12 text-hologram-blue animate-pulse" />
            <span className="text-xl font-tech text-electric-blue">Mesaj trimis cu succes!</span>
            <p className="text-white/80">Iți vom răspunde în cel mai scurt timp.</p>
          </div>
        ) : (
          <form
            className="space-y-5"
            onSubmit={e => {
              e.preventDefault();
              setSent(true);
              setTimeout(() => setSent(false), 2500);
            }}
          >
            <input
              className="w-full px-4 py-3 rounded bg-dark-matter/60 border border-hologram-blue text-white focus:outline-none focus:border-electric-blue transition-all"
              placeholder="Nume"
              required
            />
            <input
              className="w-full px-4 py-3 rounded bg-dark-matter/60 border border-hologram-blue text-white focus:outline-none focus:border-electric-blue transition-all"
              type="email"
              placeholder="Email"
              required
            />
            <textarea
              className="w-full px-4 py-3 rounded bg-dark-matter/60 border border-hologram-blue text-white focus:outline-none focus:border-electric-blue resize-none transition-all"
              placeholder="Mesajul tău"
              rows={4}
              required
            />
            <button
              className="w-full electric-button font-tech text-lg tracking-wider relative overflow-hidden"
              type="submit"
            >
              <span className="relative z-10">Transmite În Viitor</span>
              <Rocket className="absolute right-3 top-1/2 -translate-y-1/2 text-electric-blue animate-float" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
export default Contact;
