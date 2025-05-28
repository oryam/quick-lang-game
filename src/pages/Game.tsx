
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGameState } from "@/hooks/useGameState";
import { Play, ArrowRight, Pause, Volume } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { languages } from "@/data/words";

const Game = () => {
  const navigate = useNavigate();
  const { 
    settings,
    setSettings,
    gameWords,
    currentWordIndex,
    currentWord,
    currentTranslation,
    showTranslation,
    isPlaying,
    timeLeft,
    isPaused,
    initializeGame,
    isGameFinished,
    nextWord,
    togglePause,
    wordTranslations
  } = useGameState();
  
  // Référence pour l'élément audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Récupérer les paramètres du jeu depuis le sessionStorage
  useEffect(() => {
    const savedSettings = sessionStorage.getItem('gameSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [setSettings]);

  // Initialiser le jeu une fois que les paramètres sont chargés
  useEffect(() => {
    if (settings.sourceLanguage && settings.targetLanguage) {
      initializeGame();
    }
  }, [settings, initializeGame]);

  // Helper function to get language label from ID
  const getLanguageLabel = (languageId: string) => {
    const language = languages.find(lang => lang.id === languageId);
    return language ? language.label : languageId;
  };

  const handleRestart = () => {
    initializeGame();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleNextWord = () => {
    nextWord();
  };

  // Fonction pour lire la prononciation du mot
  const handlePlayPronunciation = (text: string, lang: string) => {
    try {
      if (!audioRef.current) return;
      
      // Créer l'URL pour Google Text-to-Speech API
      let ttsLang;
      switch (lang) {
        case 'fr':
          ttsLang = 'fr-FR';
          break;
        case 'kr':
          ttsLang = 'ko-KR';
          break;
        case 'en':
          ttsLang = 'en-US';
          break;
        default:
          ttsLang = 'en-US';
      }
      
      const encodedText = encodeURIComponent(text || '');
      
      if (encodedText) {
        // Utiliser l'API de synthèse vocale de Google
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${ttsLang}&q=${encodedText}`;
        
        // Mettre à jour la source audio et lire
        audioRef.current.src = url;
        audioRef.current.play()
          .catch(error => {
            console.error("Erreur de lecture audio:", error);
            toast({
              title: "Erreur de lecture",
              description: "Impossible de lire le son pour ce mot."
            });
          });
      }
    } catch (error) {
      console.error("Erreur lors de la lecture de la prononciation:", error);
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    // Find actual category information from data source if needed
    // This is a simple approximation, you might want to use a lookup from getAllCategories()
    switch (categoryId) {
      case 'CORPS_HUMAIN':
        return 'Corps Humain';
      case 'FRUIT':
        return 'Fruit';
      case 'ACTION':
        return 'Action';
      default:
        return categoryId;
    }
  };

  if (!currentWord) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  const progress = currentWordIndex / gameWords.length * 100;
  const timeProgress = (timeLeft / (showTranslation ? 5 : 10)) * 100;

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center">
            {getLanguageLabel(settings.sourceLanguage)} → {getLanguageLabel(settings.targetLanguage)}
          </h1>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Mot {currentWordIndex + 1} sur {gameWords.length}</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Element audio pour la lecture de la prononciation */}
        <audio ref={audioRef} />

        {/* Game area */}
        {isPlaying ? (
          <>
            <Card className="border-2 shadow-lg mb-8 h-80 flex flex-col">
              <CardContent className="flex flex-col items-center justify-center p-6 h-full relative">
                {/* Timer */}
                <div className="absolute top-0 left-0 right-0 p-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{timeLeft}s</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={togglePause} 
                      className="w-6 h-6 p-0"
                      aria-label={isPaused ? "Reprendre" : "Pause"}
                    >
                      {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Progress value={timeProgress} className="h-1" />
                </div>

                {/* Word display */}
                <div className={`transition-all duration-500 ${showTranslation ? 'opacity-30 scale-90' : 'opacity-100'}`}>
                  <p className="text-gray-500 mb-2 text-center">{showTranslation ? "Mot d'origine" : "Mémorisez ce mot"}</p>
                  <div className="text-5xl font-bold text-langlearn-blue-dark mb-4 text-center">
                    {currentWord.text}
                  </div>
                  <p className="text-gray-500 text-center">
                    Catégorie: {getCategoryLabel(currentWord.category)}
                  </p>
                </div>

                {/* Translation */}
                {showTranslation && currentTranslation && (
                  <div className="mt-8 animate-fade-in">
                    <p className="text-gray-500 mb-2 text-center">Traduction</p>
                    <div className="text-5xl font-bold text-langlearn-green-dark text-center flex items-center justify-center gap-3">
                      {currentTranslation.text}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePlayPronunciation(currentTranslation.text, settings.targetLanguage)}
                        className="rounded-full bg-langlearn-blue text-white hover:bg-langlearn-blue-dark"
                        aria-label="Écouter la prononciation"
                      >
                        <Volume className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4 mb-4">
              <Button 
                onClick={handleNextWord}
                className="bg-langlearn-blue hover:bg-langlearn-blue-dark text-white"
              >
                Mot suivant <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="text-center text-gray-500">
              {!showTranslation ? (
                isPaused ? (
                  <p>Timer en pause. Cliquez sur le bouton play pour continuer.</p>
                ) : (
                  <p>Mémorisez le mot, la traduction apparaîtra dans {timeLeft} secondes</p>
                )
              ) : (
                isPaused ? (
                  <p>Timer en pause. Cliquez sur le bouton play pour continuer.</p>
                ) : (
                  <p>Passez au mot suivant dans {timeLeft} secondes</p>
                )
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            {isGameFinished ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-langlearn-green-dark">Félicitations !</h2>
                <p className="text-xl mb-6">Vous avez terminé la session d'apprentissage</p>
                
                {/* Liste des mots de la session */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Récapitulatif des mots</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {getLanguageLabel(settings.sourceLanguage)}
                          </TableHead>
                          <TableHead>
                            {getLanguageLabel(settings.targetLanguage)}
                          </TableHead>
                          <TableHead>Catégorie</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wordTranslations.map((pair, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{pair.source.text}</TableCell>
                            <TableCell>{pair.target.text}</TableCell>
                            <TableCell>{getCategoryLabel(pair.source.category)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleRestart}
                    className="bg-langlearn-green hover:bg-langlearn-green-dark text-white"
                  >
                    <Play className="mr-2 h-4 w-4" /> Rejouer
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleBackToHome}
                  >
                    Retour à l'accueil
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                onClick={initializeGame}
                className="bg-langlearn-blue hover:bg-langlearn-blue-dark text-white"
              >
                <Play className="mr-2 h-4 w-4" /> Commencer
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
