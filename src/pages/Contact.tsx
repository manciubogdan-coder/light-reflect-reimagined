
import { useState } from "react";
import { Rocket, Atom, Zap } from "lucide-react";
import ElectricText from "../components/ElectricText";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { toast } from "sonner";

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nume: "",
    email: "",
    mesaj: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nume || !formData.email || !formData.mesaj) {
      toast.error("Te rugăm să completezi toate câmpurile!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://acmknwxnyibvbbltfdxh.functions.supabase.co/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Eroare la trimiterea mesajului.");
      }

      toast.success("Mesajul tău a fost trimis cu succes!");
      setSent(true);
      setLoading(false);

      setTimeout(() => {
        setSent(false);
        setFormData({ nume: "", email: "", mesaj: "" });
      }, 3000);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || "A apărut o eroare. Încearcă din nou!");
    }
  };

  return (
    <div className="min-h-screen bg-dark-matter overflow-hidden">
      <Nav />
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
              onSubmit={handleSubmit}
            >
              <input
                className="w-full px-4 py-3 rounded bg-dark-matter/60 border border-hologram-blue text-white focus:outline-none focus:border-electric-blue transition-all"
                placeholder="Nume"
                name="nume"
                value={formData.nume}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                className="w-full px-4 py-3 rounded bg-dark-matter/60 border border-hologram-blue text-white focus:outline-none focus:border-electric-blue transition-all"
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <textarea
                className="w-full px-4 py-3 rounded bg-dark-matter/60 border border-hologram-blue text-white focus:outline-none focus:border-electric-blue resize-none transition-all"
                placeholder="Mesajul tău"
                name="mesaj"
                value={formData.mesaj}
                onChange={handleChange}
                rows={4}
                required
                disabled={loading}
              />
              <button
                className="w-full electric-button font-tech text-lg tracking-wider relative overflow-hidden disabled:opacity-70 disabled:pointer-events-none"
                type="submit"
                disabled={loading}
              >
                <span className="relative z-10">
                  {loading ? "Se trimite..." : "Transmite În Viitor"}
                </span>
                <Rocket className="absolute right-3 top-1/2 -translate-y-1/2 text-electric-blue animate-float" />
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
