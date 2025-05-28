
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Game from "./pages/Game";
import WordsManager from "./pages/WordsManager";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { initializeData } from "./data/words";

const queryClient = new QueryClient();

const App = () => {
  // Initialiser les données au démarrage de l'application
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="game" element={<Game />} />
                <Route path="words-manager" element={<WordsManager />} />
                <Route path="/quick-lang-game" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
