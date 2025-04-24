
import { useState } from "react";
import { Rocket } from "lucide-react";
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        headers: {
          "Content-Type": "application/json",
          "Origin": window.location.origin
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Eroare la trimiterea mesajului.");
      }

      toast.success("Mesajul tău a fost trimis cu succes!");
      setSent(true);
      setLoading(false);
      
      setTimeout(() => {
        setSent(false);
        setFormData({
          nume: "",
          email: "",
          mesaj: ""
        });
      }, 3000);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || "A apărut o eroare. Încearcă din nou!");
      console.error("Contact form error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-matter">
      <Nav />
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center py-24">
        {/* Background with lines and particles */}
        <div className="absolute inset-0 bg-circuit-pattern bg-cover bg-center opacity-20 z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-matter/80 via-hologram-blue/10 to-electric-blue/10 z-0" />

        <div className="relative z-20 max-w-xl w-full tech-panel shadow-xl p-8">
          <ElectricText text="Contact" className="text-3xl md:text-4xl font-tech mb-6 text-hologram-blue text-center" />
          <p className="text-white/70 mb-8 font-future text-lg text-center">
            Trimite-ne un mesaj și revenim cât mai curând posibil ⚡
          </p>
          
          {sent ? (
            <div className="flex flex-col items-center gap-3">
              <span className="text-xl font-tech text-electric-blue">Mesaj trimis cu succes!</span>
              <p className="text-white/80">Iți vom răspunde în cel mai scurt timp.</p>
            </div>
          ) : (
            <form className="space-y-5 relative z-30" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nume" className="block text-white text-sm font-medium mb-2">Nume</label>
                <input 
                  id="nume"
                  name="nume"
                  type="text"
                  value={formData.nume}
                  onChange={handleChange}
                  placeholder="Nume"
                  className="w-full p-3 rounded-md bg-dark-matter/60 border border-hologram-blue text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue relative z-30"
                  disabled={loading}
                  required
                  autoComplete="off"
                  style={{cursor: "text"}}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email</label>
                <input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-3 rounded-md bg-dark-matter/60 border border-hologram-blue text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue relative z-30"
                  disabled={loading}
                  required
                  autoComplete="off"
                  style={{cursor: "text"}}
                />
              </div>
              
              <div>
                <label htmlFor="mesaj" className="block text-white text-sm font-medium mb-2">Mesaj</label>
                <textarea 
                  id="mesaj"
                  name="mesaj"
                  value={formData.mesaj}
                  onChange={handleChange}
                  placeholder="Mesajul tău"
                  rows={4}
                  className="w-full p-3 rounded-md bg-dark-matter/60 border border-hologram-blue text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue resize-none relative z-30"
                  disabled={loading}
                  required
                  autoComplete="off"
                  style={{cursor: "text"}}
                />
              </div>
              
              <button 
                className="w-full electric-button font-tech text-lg tracking-wider py-3 relative z-30" 
                type="submit" 
                disabled={loading}
              >
                <span className="relative z-10">
                  {loading ? "Se trimite..." : "Transmite În Viitor"}
                </span>
                <Rocket className="absolute right-3 top-1/2 -translate-y-1/2 text-electric-blue" />
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
