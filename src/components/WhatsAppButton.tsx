import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/40752954772"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Scrie-ne pe WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/40 transition-all duration-300 hover:scale-110 animate-pulse"
    >
      <MessageCircle className="w-7 h-7" fill="white" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 animate-ping"></span>
    </a>
  );
};

export default WhatsAppButton;
