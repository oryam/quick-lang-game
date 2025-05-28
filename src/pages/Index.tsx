
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Language, WordCategory, getAllCategories, getLanguages } from "@/data/words";
import { Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState(getLanguages());
  const [sourceLanguage, setSourceLanguage] = useState<Language>("fr");
  const [targetLanguage, setTargetLanguage] = useState<Language>("kr");
  const [wordCount, setWordCount] = useState(5);
  const [availableCategories, setAvailableCategories] = useState<{id: WordCategory; label: string}[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<WordCategory[]>([]);

  useEffect(() => {
    // Load dynamic languages and categories from storage
    const currentLanguages = getLanguages();
    setLanguages(currentLanguages);
    
    // Set default languages if available
    if (currentLanguages.length > 0) {
      setSourceLanguage(currentLanguages[0].id);
      setTargetLanguage(currentLanguages[1]?.id || currentLanguages[0].id);
    }
    
    const categoryList = getAllCategories();
    setAvailableCategories(categoryList);
    // Initialize selected categories with all available ones
    setSelectedCategories(categoryList.map(c => c.id as WordCategory));
  }, []);

  const handleCategoryToggle = (category: WordCategory) => {
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) { // Toujours garder au moins une catégorie
        setSelectedCategories(selectedCategories.filter(c => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleStartGame = () => {
    // Stocker les paramètres du jeu dans le sessionStorage
    sessionStorage.setItem('gameSettings', JSON.stringify({
      sourceLanguage,
      targetLanguage,
      wordCount,
      categories: selectedCategories
    }));
    
    // Rediriger vers la page de jeu
    navigate('/game');
  };
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-langlearn-blue-dark">LangLearn</h1>
          <p className="text-lg text-gray-600">Apprenez une langue avec vos amis de façon ludique</p>
        </div>
      
        <Card className="shadow-lg border-langlearn-blue-dark/20">
          <CardHeader className="bg-gradient-to-r from-langlearn-blue to-langlearn-green text-white">
            <CardTitle className="text-2xl">Nouvelle partie</CardTitle>
            <CardDescription className="text-white/80">Configurez votre session d'apprentissage</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sourceLanguage">Langue source</Label>
                  <Select 
                    value={sourceLanguage} 
                    onValueChange={(value) => {
                      setSourceLanguage(value as Language);
                      // Éviter d'avoir la même langue source et cible
                      if (value === targetLanguage) {
                        const otherLanguage = languages.find(l => l.id !== value)?.id as Language;
                        setTargetLanguage(otherLanguage);
                      }
                    }}
                  >
                    <SelectTrigger id="sourceLanguage">
                      <SelectValue placeholder="Sélectionner une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetLanguage">Langue cible</Label>
                  <Select 
                    value={targetLanguage} 
                    onValueChange={(value) => {
                      setTargetLanguage(value as Language);
                      // Éviter d'avoir la même langue source et cible
                      if (value === sourceLanguage) {
                        const otherLanguage = languages.find(l => l.id !== value)?.id as Language;
                        setSourceLanguage(otherLanguage);
                      }
                    }}
                  >
                    <SelectTrigger id="targetLanguage">
                      <SelectValue placeholder="Sélectionner une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wordCount">Nombre de mots</Label>
                <Select 
                  value={wordCount.toString()} 
                  onValueChange={(value) => setWordCount(parseInt(value))}
                >
                  <SelectTrigger id="wordCount">
                    <SelectValue placeholder="Sélectionner le nombre de mots" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25].map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count} mots
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label>Catégories</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {availableCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        disabled={selectedCategories.length === 1 && selectedCategories.includes(category.id)}
                      />
                      <Label htmlFor={category.id} className="cursor-pointer">{category.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end bg-gray-50 rounded-b-lg p-4">
            <Button 
              onClick={handleStartGame}
              className="bg-langlearn-green hover:bg-langlearn-green-dark text-white"
            >
              <Play className="mr-2 h-4 w-4" /> Commencer
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 p-6 bg-langlearn-beige/50 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-langlearn-blue-dark">Comment jouer</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Configurez la langue source et la langue cible</li>
            <li>Choisissez le nombre de mots que vous voulez apprendre</li>
            <li>Sélectionnez les catégories qui vous intéressent</li>
            <li>Appuyez sur "Commencer" pour lancer la session</li>
            <li>Chaque mot s'affichera pendant 10 secondes, puis sa traduction apparaîtra</li>
            <li>Pratiquez avec vos amis pour améliorer votre vocabulaire !</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
