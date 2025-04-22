
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Book } from "lucide-react";

const Blog = () => (
  <div className="min-h-screen bg-dark-matter flex flex-col">
    <Nav />
    <main className="flex-1 flex items-center justify-center py-16">
      <div className="max-w-2xl w-full tech-panel hologram p-8 text-center">
        <Book className="mx-auto mb-4 text-hologram-blue w-10 h-10" />
        <h1 className="font-tech text-3xl md:text-4xl text-hologram-blue mb-4">Blog</h1>
        <p className="text-white/80 mb-3">
          Sfaturi, idei și noutăți din energie & instalații electrice. Ai grijă să revii, urmează articole interesante!
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Blog;
