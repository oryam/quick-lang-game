
import { useState, useEffect, useCallback } from 'react';
import { Language, Word, getWordsByLanguage, getTranslation } from '../data/words';

interface GameSettings {
  sourceLanguage: Language;
  targetLanguage: Language;
  wordCount: number;
  categories: string[];
}

interface WordPair {
  source: Word;
  target: Word;
}

export const useGameState = () => {
  const [settings, setSettings] = useState<GameSettings>({
    sourceLanguage: 'fr',
    targetLanguage: 'ko',
    wordCount: 5,
    categories: ['CORPS_HUMAIN', 'FRUIT', 'ACTION']
  });
  
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [wordTranslations, setWordTranslations] = useState<WordPair[]>([]);
  
  // Initialisation des mots pour le jeu
  const initializeGame = useCallback(() => {
    // Récupérer tous les mots de la langue source
    let allWords = getWordsByLanguage(settings.sourceLanguage);
    
    // Filtrer par catégories si spécifié
    if (settings.categories.length > 0 && settings.categories[0] !== 'all') {
      allWords = allWords.filter(word => settings.categories.includes(word.category));
    }
    
    // Mélanger les mots
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    
    // Sélectionner le nombre de mots demandé
    const selectedWords = shuffled.slice(0, settings.wordCount);
    
    // Créer des paires de mots avec leurs traductions
    const pairs: WordPair[] = selectedWords.map(word => {
      const translation = getTranslation(word.id, settings.targetLanguage);
      return {
        source: word,
        target: translation || { 
          id: generateFallbackId(word.text, settings.targetLanguage), 
          text: 'Traduction non disponible', 
          language: settings.targetLanguage, 
          category: word.category 
        }
      };
    });
    
    setGameWords(selectedWords);
    setWordTranslations(pairs);
    setCurrentWordIndex(0);
    setShowTranslation(false);
    setTimeLeft(10);
    setIsPlaying(true);
    setIsPaused(false);
  }, [settings]);
  
  // Générer un ID de remplacement (format string comme attendu dans Word)
  const generateFallbackId = (text: string, language: Language): string => {
    return `fallback_${language}_${text.toLowerCase().replace(/\s/g, '_')}`;
  };
  
  // Récupérer le mot actuel
  const currentWord = gameWords[currentWordIndex];
  
  // Récupérer la traduction du mot actuel
  const currentTranslation = wordTranslations[currentWordIndex]?.target;
  
  // Passer au mot suivant
  const nextWord = useCallback(() => {
    if (currentWordIndex < gameWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowTranslation(false);
      setTimeLeft(10);
      setIsPaused(false);
    } else {
      // Fin du jeu
      setIsPlaying(false);
    }
  }, [currentWordIndex, gameWords.length]);

  // Activer/désactiver la pause
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);
  
  // Gérer le timer
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    
    if (isPlaying && timeLeft > 0 && !isPaused) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0 && !isPaused) {
      if (!showTranslation) {
        // Si la traduction n'est pas encore affichée, l'afficher et réinitialiser le timer
        setShowTranslation(true);
        setTimeLeft(5); // On affiche la traduction pendant 5 secondes
      } else {
        // Si la traduction est déjà affichée, passer au mot suivant
        nextWord();
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, showTranslation, timeLeft, nextWord, isPaused]);
  
  return {
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
    nextWord,
    togglePause,
    isGameFinished: !isPlaying && gameWords.length > 0 && currentWordIndex === gameWords.length - 1,
    wordTranslations
  };
};
