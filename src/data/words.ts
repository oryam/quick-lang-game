
export type Language = 'fr' | 'kr' | 'en';

export type WordCategory = string;

export interface Word {
  id: string;
  text: string;
  language: Language;
  category: WordCategory;
}

export interface TranslationGroup {
  id: string;
  category: WordCategory;
  translations: Record<Language, string>;
}

// Updated language definitions with id directly as the language key
export const languages: { id: Language; label: string }[] = [
  { id: 'fr', label: 'Français' },
  { id: 'kr', label: 'Coréen' },
  { id: 'en', label: 'Anglais' }
];

// Générer un ID unique pour un groupe de traduction
const generateGroupId = (): string => {
  return `group_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Générer un ID unique basé sur le texte et la langue
const generateId = (text: string, language: Language): string => {
  return `${language}_${text.toLowerCase().replace(/\s/g, '_')}`;
};

// Structure enrichie avec plus de mots pour initialiser l'app
const defaultTranslationGroups: TranslationGroup[] = [
  // CORPS HUMAIN
  {
    id: generateGroupId(),
    category: 'CORPS_HUMAIN',
    translations: {
      fr: 'tête',
      kr: '머리',
      en: 'head'
    }
  },
  {
    id: generateGroupId(),
    category: 'CORPS_HUMAIN',
    translations: {
      fr: 'main',
      kr: '손',
      en: 'hand'
    }
  },
  {
    id: generateGroupId(),
    category: 'CORPS_HUMAIN',
    translations: {
      fr: 'pied',
      kr: '발',
      en: 'foot'
    }
  },
  {
    id: generateGroupId(),
    category: 'CORPS_HUMAIN',
    translations: {
      fr: 'bras',
      kr: '팔',
      en: 'arm'
    }
  },
  {
    id: generateGroupId(),
    category: 'CORPS_HUMAIN',
    translations: {
      fr: 'nez',
      kr: '코',
      en: 'nose'
    }
  },
  {
    id: generateGroupId(),
    category: 'CORPS_HUMAIN',
    translations: {
      fr: 'yeux',
      kr: '눈',
      en: 'eyes'
    }
  },
  {
    id: generateGroupId(),
    category: 'CORPS_HUMAIN',
    translations: {
      fr: 'bouche',
      kr: '입',
      en: 'mouth'
    }
  },

  // FRUIT
  {
    id: generateGroupId(),
    category: 'FRUIT',
    translations: {
      fr: 'pomme',
      kr: '사과',
      en: 'apple'
    }
  },
  {
    id: generateGroupId(),
    category: 'FRUIT',
    translations: {
      fr: 'pêche',
      kr: '복숭아',
      en: 'peach'
    }
  },
  {
    id: generateGroupId(),
    category: 'FRUIT',
    translations: {
      fr: 'poire',
      kr: '배',
      en: 'pear'
    }
  },
  {
    id: generateGroupId(),
    category: 'FRUIT',
    translations: {
      fr: 'mangue',
      kr: '망고',
      en: 'mango'
    }
  },
  {
    id: generateGroupId(),
    category: 'FRUIT',
    translations: {
      fr: 'fraise',
      kr: '딸기',
      en: 'strawberry'
    }
  },
  {
    id: generateGroupId(),
    category: 'FRUIT',
    translations: {
      fr: 'figue',
      kr: '무화과',
      en: 'fig'
    }
  },
  {
    id: generateGroupId(),
    category: 'FRUIT',
    translations: {
      fr: 'ananas',
      kr: '파인애플',
      en: 'pineapple'
    }
  },

  // ACTION
  {
    id: generateGroupId(),
    category: 'ACTION',
    translations: {
      fr: 'aller',
      kr: '가다',
      en: 'go'
    }
  },
  {
    id: generateGroupId(),
    category: 'ACTION',
    translations: {
      fr: 'partir',
      kr: '떠나다',
      en: 'leave'
    }
  },
  {
    id: generateGroupId(),
    category: 'ACTION',
    translations: {
      fr: 'venir',
      kr: '오다',
      en: 'come'
    }
  },
  {
    id: generateGroupId(),
    category: 'ACTION',
    translations: {
      fr: 'courir',
      kr: '달리다',
      en: 'run'
    }
  },
  {
    id: generateGroupId(),
    category: 'ACTION',
    translations: {
      fr: 'marcher',
      kr: '걷다',
      en: 'walk'
    }
  },
  {
    id: generateGroupId(),
    category: 'ACTION',
    translations: {
      fr: 'parler',
      kr: '말하다',
      en: 'speak'
    }
  },
  {
    id: generateGroupId(),
    category: 'ACTION',
    translations: {
      fr: 'lancer',
      kr: '던지다',
      en: 'throw'
    }
  },
  {
    id: generateGroupId(),
    category: 'ACTION',
    translations: {
      fr: 'sauter',
      kr: '뛰다',
      en: 'jump'
    }
  },
  {
    id: generateGroupId(),
    category: 'ACTION',
    translations: {
      fr: 'cuisiner',
      kr: '요리하다',
      en: 'cook'
    }
  },
  {
    id: generateGroupId(),
    category: 'ACTION',
    translations: {
      fr: 'nettoyer',
      kr: '청소하다',
      en: 'clean'
    }
  }
];

// Convertir les groupes de traduction en mots individuels
export const convertToWords = (
  groups: TranslationGroup[]
): { words: Word[], pairs: TranslationPair[] } => {
  const words: Word[] = [];
  const pairs: TranslationPair[] = [];
  
  groups.forEach(group => {
    const wordsInGroup: Word[] = [];
    
    // Créer des mots pour chaque langue qui a une traduction non vide
    Object.entries(group.translations).forEach(([lang, text]) => {
      if (text && text.trim() !== '') {
        const language = lang as Language;
        const word: Word = {
          id: generateId(text, language),
          text: text,
          language: language,
          category: group.category
        };
        words.push(word);
        wordsInGroup.push(word);
      }
    });
    
    // Créer les paires de traduction
    for (let i = 0; i < wordsInGroup.length; i++) {
      for (let j = i + 1; j < wordsInGroup.length; j++) {
        pairs.push({
          id: `${group.id}_${i}_${j}`,
          sourceId: wordsInGroup[i].id,
          targetId: wordsInGroup[j].id
        });
      }
    }
  });
  
  return { words, pairs };
};

export interface TranslationPair {
  id: string;
  sourceId: string;
  targetId: string;
}

// Récupérer le tableau de traduction à partir du localStorage ou utiliser des données par défaut
export const getTranslationTable = (): TranslationGroup[] => {
  const savedGroups = localStorage.getItem('langLearnTranslationGroups');
  if (savedGroups) {
    try {
      // Tentative de parsage des données existantes
      return JSON.parse(savedGroups);
    } catch (error) {
      console.error("Erreur lors du parsage des données stockées:", error);
      // En cas d'erreur, réinitialiser avec les données par défaut
      saveTranslationGroupsToLocalStorage(defaultTranslationGroups);
      return defaultTranslationGroups;
    }
  }
  
  // Initialiser avec les données par défaut
  saveTranslationGroupsToLocalStorage(defaultTranslationGroups);
  return defaultTranslationGroups;
};

// Réinitialiser complètement les données stockées avec les valeurs par défaut
export const resetTranslationData = (): TranslationGroup[] => {
  // Supprimer toutes les données existantes
  localStorage.removeItem('langLearnTranslationGroups');
  localStorage.removeItem('langLearnWords');
  localStorage.removeItem('langLearnTranslationPairs');
  
  // Sauvegarder les données par défaut
  saveTranslationGroupsToLocalStorage(defaultTranslationGroups);
  return defaultTranslationGroups;
};

// Sauvegarder le tableau de traduction dans le localStorage
export const saveTranslationGroupsToLocalStorage = (groups: TranslationGroup[]): void => {
  localStorage.setItem('langLearnTranslationGroups', JSON.stringify(groups));
  
  // Convertir en mots et paires pour assurer la compatibilité avec le reste de l'app
  const { words, pairs } = convertToWords(groups);
  localStorage.setItem('langLearnWords', JSON.stringify(words));
  localStorage.setItem('langLearnTranslationPairs', JSON.stringify(pairs));
};

// Parser pour le format CSV
export const parseCsvData = (csvContent: string): TranslationGroup[] => {
  try {
    // Split by newlines and filter out empty lines
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      throw new Error('Le fichier CSV doit contenir au moins 2 lignes (en-tête + données)');
    }
    
    // Parse header
    const header = lines[0].split('|');
    
    if (header.length < 2) {
      throw new Error('L\'en-tête du CSV doit contenir au moins une catégorie et une langue');
    }
    
    // First column should be category
    if (header[0].toLowerCase() !== 'category') {
      throw new Error('La première colonne doit être "category"');
    }
    
    // Map language codes to Language type
    const languageMap: Record<string, Language> = {
      'fr': 'fr',
      'kr': 'kr',
      'en': 'en'
    };
    
    // Extract language columns
    const languageColumns: { index: number; language: Language }[] = [];
    for (let i = 1; i < header.length; i++) {
      const langCode = header[i].toLowerCase() as Language;
      
      if (!['fr', 'kr', 'en'].includes(langCode)) {
        throw new Error(`Code de langue non reconnu: ${langCode}. Utilisez fr, kr, ou en.`);
      }
      
      languageColumns.push({ index: i, language: langCode });
    }
    
    // Parse data rows
    const translationGroups: TranslationGroup[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split('|');
      
      if (values.length < header.length) {
        throw new Error(`La ligne ${i + 1} ne contient pas assez de colonnes`);
      }
      
      const category = values[0].trim();
      const translations: Record<Language, string> = {
        fr: '',
        kr: '',
        en: ''
      };
      
      // Map translations to appropriate languages
      languageColumns.forEach(col => {
        translations[col.language] = values[col.index].trim();
      });
      
      // Only add if at least one translation exists
      if (Object.values(translations).some(t => t !== '')) {
        translationGroups.push({
          id: generateGroupId(),
          category,
          translations
        });
      }
    }
    
    return translationGroups;
  } catch (error) {
    console.error('Erreur lors du parsing CSV:', error);
    throw error;
  }
};

// Convertir les groupes de traduction en format CSV
export const convertToCsvFormat = (groups: TranslationGroup[]): string => {
  try {
    // Create header with language ids directly
    const header = ['category', 'fr', 'kr', 'en'];
    
    // Create rows
    const rows = groups.map(group => {
      const row = [group.category];
      
      // Add each language translation
      for (const lang of ['fr', 'kr', 'en'] as Language[]) {
        row.push(group.translations[lang] || '');
      }
      
      return row;
    });
    
    // Combine header and rows
    const allRows = [header, ...rows];
    
    // Convert to CSV format
    const csvContent = allRows.map(row => row.join('|')).join('\n');
    
    return csvContent;
  } catch (error) {
    console.error('Erreur lors de la conversion en CSV:', error);
    throw error;
  }
};

// Ajouter un groupe de traduction
export const addTranslationGroup = (group: Omit<TranslationGroup, 'id'>): TranslationGroup => {
  const groups = getTranslationTable();
  const newGroup = { ...group, id: generateGroupId() };
  const updatedGroups = [...groups, newGroup];
  saveTranslationGroupsToLocalStorage(updatedGroups);
  return newGroup;
};

// Mettre à jour un groupe de traduction
export const updateTranslationGroup = (group: TranslationGroup): void => {
  const groups = getTranslationTable();
  const updatedGroups = groups.map(g => g.id === group.id ? group : g);
  saveTranslationGroupsToLocalStorage(updatedGroups);
};

// Supprimer un groupe de traduction
export const deleteTranslationGroup = (id: string): void => {
  const groups = getTranslationTable();
  const updatedGroups = groups.filter(group => group.id !== id);
  saveTranslationGroupsToLocalStorage(updatedGroups);
};

// Récupérer les groupes de traduction par catégorie
export const getTranslationGroupsByCategory = (category: WordCategory | 'all'): TranslationGroup[] => {
  const groups = getTranslationTable();
  if (category === 'all') return groups;
  return groups.filter(group => group.category === category);
};

// Récupérer toutes les catégories disponibles
export const getAllCategories = (): { id: WordCategory; label: string }[] => {
  const groups = getTranslationTable();
  
  // Extract unique categories
  const uniqueCategories = [...new Set(groups.map(group => group.category))];
  
  // Create category objects
  return uniqueCategories.map(categoryId => ({
    id: categoryId,
    label: getCategoryLabel(categoryId)
  }));
};

// Helper to get readable category label
const getCategoryLabel = (categoryId: string): string => {
  switch (categoryId) {
    case 'CORPS_HUMAIN':
      return 'Corps Humain';
    case 'FRUIT':
      return 'Fruit';
    case 'ACTION':
      return 'Action';
    default:
      // If it's a custom category, use a more readable format
      return categoryId.charAt(0).toUpperCase() + 
        categoryId.slice(1).toLowerCase().replace(/_/g, ' ');
  }
};

// Récupérer les mots par langue
export const getWordsByLanguage = (language: Language): Word[] => {
  const { words } = convertToWords(getTranslationTable());
  return words.filter(word => word.language === language);
};

// Récupérer les mots par catégorie
export const getWordsByCategory = (category: WordCategory, language: Language): Word[] => {
  const { words } = convertToWords(getTranslationTable());
  return words.filter(word => word.category === category && word.language === language);
};

// Pour compatibilité avec le reste de l'app
export const getTranslation = (wordId: string, targetLanguage: Language): Word | undefined => {
  const { words, pairs } = convertToWords(getTranslationTable());
  
  const sourceWord = words.find(word => word.id === wordId);
  if (!sourceWord) return undefined;
  
  // Find pairs that include this word
  const relevantPairs = pairs.filter(pair => 
    pair.sourceId === wordId || pair.targetId === wordId
  );
  
  // Look for a word in the target language
  for (const pair of relevantPairs) {
    const otherId = pair.sourceId === wordId ? pair.targetId : pair.sourceId;
    const word = words.find(w => w.id === otherId && w.language === targetLanguage);
    if (word) return word;
  }
  
  return undefined;
};

// Initialisation pour assurer que les données existent
export const initializeData = (): { words: Word[], groups: TranslationGroup[] } => {
  // Réinitialiser les données avec les valeurs par défaut
  resetTranslationData();
  
  const groups = getTranslationTable(); 
  const { words } = convertToWords(groups);
  return { words, groups };
};
