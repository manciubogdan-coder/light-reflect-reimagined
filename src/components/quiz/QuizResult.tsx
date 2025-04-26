
import React from "react";
import { ElectricianProfile } from "@/lib/quizTypes";
import { profilesData } from "@/lib/quizData";
import { Button } from "@/components/ui/button";
import { Facebook, Lightbulb, Clock, Wrench, Zap, RefreshCcw, Share } from "lucide-react";
import { toast } from "sonner";
import { generateQuizResultImage } from "@/utils/quizImageGenerator";

interface QuizResultProps {
  profile: ElectricianProfile;
  onRestart: () => void;
  onBecomePartner: () => void;
}

const QuizResult = ({ profile, onRestart, onBecomePartner }: QuizResultProps) => {
  const profileData = profilesData[profile];
  
  const getProfileIcon = () => {
    switch (profileData.icon) {
      case "lightbulb":
        return <Lightbulb className="w-12 h-12 text-electric-blue" />;
      case "wrench":
        return <Wrench className="w-12 h-12 text-electric-blue" />;
      case "zap":
        return <Zap className="w-12 h-12 text-electric-blue" />;
      case "clock":
        return <Clock className="w-12 h-12 text-electric-blue" />;
      default:
        return null;
    }
  };
  
  const shareResult = async (platform: string) => {
    try {
      toast.info("Se generează imaginea pentru partajare...");
      
      const resultImage = await generateQuizResultImage(
        profileData.title,
        `${profileData.description}\n\nAflă și tu ce tip de electrician ești pe Light Reflect Electrical!`
      );
      
      if (platform === 'facebook') {
        // Create a temporary URL for the image
        const blobUrl = URL.createObjectURL(resultImage);
        
        // Open Facebook share dialog directly
        // Note: Facebook doesn't allow direct image sharing this way, but we can share the URL
        const shareUrl = window.location.origin + '/tools/electrician-quiz?profile=' + profile;
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
        
        // Download the image for manual sharing
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'rezultat-quiz-electrician.jpg';
        link.click();
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        toast.success('Poză generată cu succes! Folosește imaginea descărcată pentru a o partaja manual pe Facebook.');
      } else if (platform === 'whatsapp') {
        // For WhatsApp, download the image and provide a link
        const blobUrl = URL.createObjectURL(resultImage);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'rezultat-quiz-electrician.jpg';
        link.click();
        
        // Then open WhatsApp with text
        const shareText = `Am făcut testul și sunt ${profileData.title}! ${profileData.shareText}`;
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
          '_blank'
        );
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        toast.success('Poză generată cu succes! Folosește imaginea descărcată pentru a o partaja manual pe WhatsApp.');
      } else if (platform === 'direct') {
        // Direct sharing fallback - just download the image
        const blobUrl = URL.createObjectURL(resultImage);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'rezultat-quiz-electrician.jpg';
        link.click();
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        toast.success('Imagine descărcată! Acum o poți partaja unde dorești.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Nu am putut genera imaginea. Încercați din nou.');
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="mb-6 flex flex-col items-center">
        <div className="bg-electric-blue/10 p-4 rounded-full mb-4 flex items-center justify-center">
          {getProfileIcon()}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-electric-blue">
          {profileData.title}
        </h2>
      </div>
      
      <p className="text-white/80 text-lg mb-6">
        {profileData.description}
      </p>
      
      <div className="bg-dark-matter/40 p-5 rounded-lg mb-8">
        <h3 className="text-xl font-tech text-electric-blue mb-3">Punctele tale forte:</h3>
        <ul className="space-y-2 text-left">
          {profileData.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="min-w-4 h-4 mt-1.5 rounded-full bg-electric-blue/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-electric-blue"></div>
              </div>
              <span className="text-white/80">{strength}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-tech text-electric-blue mb-3">Împărtășește rezultatul:</h3>
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="border-blue-500 hover:bg-blue-500/20"
              onClick={() => shareResult('facebook')}
              title="Partajează pe Facebook"
            >
              <Facebook className="h-5 w-5 text-blue-500" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="border-green-500 hover:bg-green-500/20"
              onClick={() => shareResult('whatsapp')}
              title="Partajează pe WhatsApp"
            >
              <div className="flex items-center justify-center h-5 w-5 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.4 22h-.2c-5.3-.3-3.7-1.5-7.5-5.8-4-4.5-5-8.2-5-10.9C5 2 6 1 9 1h1c1 0 1 0 2 2.5.7 2 1 2.5 1 2.5 0 1-3 2-3 3.5 0 1.6 3.2 7 8.5 7 1.5 0 2.5-3 3.5-3 .5 0 1 .5 2.5 2 1.5 1.5 2.5 1.5 2.5 2.5V21c0 .5-.5 1-2.5 1H17.4Z"/>
                </svg>
              </div>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="border-purple-500 hover:bg-purple-500/20"
              onClick={() => shareResult('direct')}
              title="Descarcă imaginea"
            >
              <Share className="h-5 w-5 text-purple-500" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <Button 
            variant="outline"
            className="bg-electric-blue hover:bg-electric-blue/80 text-white"
            onClick={onBecomePartner}
          >
            Vrei să-ți transformi stilul în sistem? Aplică pentru programul Light Reflect Pro
          </Button>
          
          <Button
            variant="ghost"
            className="text-electric-blue hover:text-electric-blue/80"
            onClick={onRestart}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Restart quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
