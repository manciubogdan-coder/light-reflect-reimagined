import { useState } from "react";
import { Download, CheckCircle, Loader2, Zap, Clock, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ebookCover from "@/assets/ebook-cover.png";
const PDF_DOWNLOAD_URL = "https://drive.google.com/file/d/1JrcB5epot10XJYK5Vk4NdLgqLehN4gMG/view?usp=drive_link";
const LeadMagnetSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
    } = {};
    if (!formData.name.trim() || formData.name.length > 100) {
      newErrors.name = "Numele este obligatoriu";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalid";
    }
    if (!formData.phone.trim() || !/^[\d\s\-+()]{6,20}$/.test(formData.phone)) {
      newErrors.phone = "Număr de telefon invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Save lead to database
      const {
        error: dbError
      } = await supabase.from('leads' as any).insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        source: 'lead_magnet'
      });
      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Nu am putut salva datele");
      }

      // Send notification email
      try {
        await supabase.functions.invoke('send-lead-notification', {
          body: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim()
          }
        });
      } catch (emailError) {
        console.error("Email notification error:", emailError);
        // Don't block the download if email fails
      }

      // Success - open PDF in new tab
      toast.success("Mulțumim! Descărcarea începe acum...");
      window.open(PDF_DOWNLOAD_URL, '_blank');

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: ""
      });
    } catch (error: any) {
      console.error("Error submitting lead:", error);
      toast.error("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left side - Book Cover */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Shadow effect */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/20 blur-xl rounded-full" />
              
              {/* Book image with 3D effect */}
              <div className="relative transform hover:scale-105 transition-transform duration-500 hover:-rotate-2">
                <img alt="Manualul Eficienței Electrice - Ghid PDF" className="w-full max-w-[320px] h-auto drop-shadow-2xl rounded-lg" src="/lovable-uploads/daddce4f-d880-47c0-9453-70edb79fbbe1.webp" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-lg pointer-events-none" />
              </div>
              
              {/* Badge */}
              <div className="absolute -top-4 -right-4 bg-electric-blue text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-12">
                GRATUIT
              </div>
            </div>
          </div>

          {/* Right side - Content & Form */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" style={{
              fontFamily: "'Inter', sans-serif"
            }}>GHIDUL EFICIENȚEI ELECTRICE</h2>
              
            </div>

            {/* Bullet points */}
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-electric-blue/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-electric-blue" />
                </div>
                <span className="text-slate-700 text-lg" style={{
                fontFamily: "'Inter', sans-serif"
              }}>
                  <strong>Cum organizam si proiectam instalatiile electrice</strong>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-electric-blue/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-electric-blue" />
                </div>
                <span className="text-slate-700 text-lg" style={{
                fontFamily: "'Inter', sans-serif"
              }}>
                  <strong>Execuție în 7 zile</strong>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-electric-blue/10 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 text-electric-blue" />
                </div>
                <span className="text-slate-700 text-lg" style={{
                fontFamily: "'Inter', sans-serif"
              }}>
                  <strong>Reducere costuri materiale 15%</strong>
                </span>
              </li>
            </ul>

            {/* Lead Capture Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nume complet" className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all ${errors.name ? 'border-red-500' : 'border-slate-300'}`} style={{
                fontFamily: "'Inter', sans-serif"
              }} disabled={isSubmitting} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email business" className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all ${errors.email ? 'border-red-500' : 'border-slate-300'}`} style={{
                fontFamily: "'Inter', sans-serif"
              }} disabled={isSubmitting} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Număr de telefon" className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all ${errors.phone ? 'border-red-500' : 'border-slate-300'}`} style={{
                fontFamily: "'Inter', sans-serif"
              }} disabled={isSubmitting} />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 px-6 bg-electric-blue hover:bg-electric-blue/90 text-white font-bold text-lg rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed" style={{
              fontFamily: "'Inter', sans-serif"
            }}>
                {isSubmitting ? <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Se procesează...
                  </> : <>
                    <Download className="w-5 h-5" />
                    DESCARCĂ GHIDUL PDF
                  </>}
              </button>

              <p className="text-center text-slate-500 text-sm" style={{
              fontFamily: "'Inter', sans-serif"
            }}>
                🔒 Datele tale sunt în siguranță. Nu facem spam.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>;
};
export default LeadMagnetSection;