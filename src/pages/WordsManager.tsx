import React, { useState, useEffect } from "react";
import { 
  TranslationGroup, WordCategory, Language,
  getTranslationTable, addTranslationGroup, updateTranslationGroup, deleteTranslationGroup,
  getAllCategories, parseCsvData, convertToCsvFormat, saveTranslationGroupsToLocalStorage,
  resetTranslationData, getLanguages, saveLanguagesToLocalStorage, LanguageDefinition
} from "@/data/words";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, 
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, Pen, Trash, X,
  Import, Download, Copy, RefreshCcw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LanguageManager from "@/components/LanguageManager";

const WordsManager = () => {
  const [translationGroups, setTranslationGroups] = useState<TranslationGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<TranslationGroup[]>([]);
  const [languages, setLanguages] = useState<LanguageDefinition[]>(getLanguages());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TranslationGroup | null>(null);
  const [newGroup, setNewGroup] = useState<{
    translations: Record<Language, string>;
    category: WordCategory;
  }>({
    translations: {},
    category: "CORPS_HUMAIN"
  });
  
  // CSV Import/Export
  const [csvContent, setCsvContent] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [exportedCsv, setExportedCsv] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  
  // Simple search
  const [searchTerm, setSearchTerm] = useState("");
  
  // État pour la gestion des catégories
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryList, setCategoryList] = useState(getAllCategories());
  const [newCategory, setNewCategory] = useState({ id: "", label: "" });
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Initialiser les traductions avec les langues disponibles
  useEffect(() => {
    const initialTranslations: Record<Language, string> = {};
    
    languages.forEach(lang => {
      initialTranslations[lang.id] = "";
    });
    
    setNewGroup(prev => ({
      ...prev,
      translations: initialTranslations
    }));
  }, [languages]);

  // Charger les groupes de traduction depuis le localStorage
  useEffect(() => {
    const loadedGroups = getTranslationTable();
    setTranslationGroups(loadedGroups);
    applySearch(loadedGroups, searchTerm);
    
    // Load categories
    setCategoryList(getAllCategories());
    
    // Log translations for debugging
    console.log("Translation groups:", loadedGroups);
  }, []);

  // Appliquer la recherche
  const applySearch = (groups: TranslationGroup[], term: string = searchTerm) => {
    if (!term.trim()) {
      setFilteredGroups(groups);
      return;
    }
    
    const lowerTerm = term.toLowerCase();
    const result = groups.filter(group => {
      // Search in all translations for all languages
      return Object.values(group.translations).some(translation => 
        translation && translation.toLowerCase().includes(lowerTerm)
      );
    });
    
    setFilteredGroups(result);
  };

  // Gestionnaire de changement de recherche
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    applySearch(translationGroups, value);
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchTerm("");
    applySearch(translationGroups, "");
  };

  // Ajouter ou mettre à jour un groupe de traduction
  const handleSaveGroup = () => {
    // Vérifier que le groupe a au moins une traduction non vide
    const hasTranslation = Object.values(newGroup.translations).some(
      text => text.trim() !== ""
    );
    
    if (!hasTranslation) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Au moins une traduction doit être renseignée"
      });
      return;
    }

    try {
      if (editingGroup) {
        // Mise à jour du groupe
        const updatedGroup = {
          ...editingGroup,
          translations: newGroup.translations,
          category: newGroup.category
        };
        updateTranslationGroup(updatedGroup);
        toast({
          title: "Groupe mis à jour",
          description: "Les traductions ont été mises à jour avec succès."
        });
      } else {
        // Ajout d'un nouveau groupe
        addTranslationGroup(newGroup);
        toast({
          title: "Traductions ajoutées",
          description: "Les nouvelles traductions ont été ajoutées avec succès."
        });
      }

      // Recharger les groupes et réinitialiser le formulaire
      const updatedGroups = getTranslationTable();
      setTranslationGroups(updatedGroups);
      applySearch(updatedGroups, searchTerm);
      setCategoryList(getAllCategories()); // Mettre à jour la liste des catégories
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement."
      });
    }
  };

  // Supprimer un groupe
  const handleDeleteGroup = (id: string) => {
    try {
      deleteTranslationGroup(id);
      
      // Recharger les groupes
      const updatedGroups = getTranslationTable();
      setTranslationGroups(updatedGroups);
      applySearch(updatedGroups, searchTerm);
      setCategoryList(getAllCategories()); // Mettre à jour la liste des catégories
      
      toast({
        title: "Suppression réussie",
        description: "Les traductions ont été supprimées avec succès."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression."
      });
    }
  };

  // Ouvrir le dialogue d'édition
  const handleEditGroup = (group: TranslationGroup) => {
    setEditingGroup(group);
    setNewGroup({
      translations: { ...group.translations },
      category: group.category
    });
    setIsDialogOpen(true);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setEditingGroup(null);
    const emptyTranslations: Record<Language, string> = {};
    languages.forEach(lang => {
      emptyTranslations[lang.id] = "";
    });
    
    setNewGroup({
      translations: emptyTranslations,
      category: "CORPS_HUMAIN"
    });
  };

  // Gérer l'import CSV
  const handleImportCsv = () => {
    try {
      if (!csvContent.trim()) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le contenu CSV est vide."
        });
        return;
      }
      
      const importedGroups = parseCsvData(csvContent);
      
      // Sauvegarder les groupes importés
      const existingGroups = getTranslationTable();
      const updatedGroups = [...existingGroups, ...importedGroups];
      
      // Save the updated groups
      saveTranslationGroupsToLocalStorage(updatedGroups);
      
      // Refresh data
      setTranslationGroups(updatedGroups);
      applySearch(updatedGroups, searchTerm);
      setCategoryList(getAllCategories()); // Mettre à jour la liste des catégories
      
      // Close dialog and reset form
      setIsImportDialogOpen(false);
      setCsvContent("");
      
      toast({
        title: "Import réussi",
        description: `${importedGroups.length} traductions ont été importées avec succès.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import."
      });
    }
  };

  // Gérer l'export CSV
  const handleExportCsv = () => {
    try {
      const csv = convertToCsvFormat(translationGroups);
      setExportedCsv(csv);
      setIsExportDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export."
      });
    }
  };

  // Copier le contenu CSV dans le presse-papiers
  const handleCopyCsv = () => {
    navigator.clipboard.writeText(exportedCsv)
      .then(() => {
        toast({
          title: "Copié !",
          description: "Le contenu CSV a été copié dans le presse-papiers."
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de copier dans le presse-papiers."
        });
      });
  };

  // Télécharger le contenu CSV
  const handleDownloadCsv = () => {
    const blob = new Blob([exportedCsv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "langlearn_words.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Afficher l'étiquette de catégorie
  const getCategoryLabel = (categoryId: WordCategory) => {
    const category = categoryList.find(c => c.id === categoryId);
    return category ? category.label : categoryId;
  };

  const handleSaveCategory = () => {
    if (!newCategory.id || !newCategory.label) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "L'identifiant et le libellé de la catégorie sont requis."
      });
      return;
    }
    
    // Vérifier si l'ID est déjà utilisé (sauf pour la catégorie en cours d'édition)
    const isDuplicate = editingCategoryIndex === null
      ? categoryList.some(cat => cat.id === newCategory.id)
      : categoryList.some((cat, index) => cat.id === newCategory.id && index !== editingCategoryIndex);
      
    if (isDuplicate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Cet identifiant de catégorie est déjà utilisé."
      });
      return;
    }

    try {
      let updatedCategories;
      
      if (editingCategoryIndex !== null) {
        // Mise à jour d'une catégorie existante
        updatedCategories = [...categoryList];
        updatedCategories[editingCategoryIndex] = newCategory;
      } else {
        // Ajout d'une nouvelle catégorie
        updatedCategories = [...categoryList, newCategory];
      }
      
      setCategoryList(updatedCategories);
      
      setNewCategory({ id: "", label: "" });
      setEditingCategoryIndex(null);
      setIsCategoryDialogOpen(false);
      
      toast({
        title: "Catégorie enregistrée",
        description: "La catégorie a été enregistrée avec succès."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la catégorie."
      });
    }
  };

  const handleEditCategory = (index: number) => {
    const category = categoryList[index];
    setNewCategory({ ...category });
    setEditingCategoryIndex(index);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (index: number) => {
    const category = categoryList[index];
    
    // Vérifier si des mots utilisent cette catégorie
    const isUsed = translationGroups.some(group => group.category === category.id);
    
    if (isUsed) {
      toast({
        variant: "destructive",
        title: "Suppression impossible",
        description: "Cette catégorie est utilisée par un ou plusieurs mots."
      });
      return;
    }
    
    const updatedCategories = [...categoryList];
    updatedCategories.splice(index, 1);
    
    setCategoryList(updatedCategories);
    
    toast({
      title: "Catégorie supprimée",
      description: "La catégorie a été supprimée avec succès."
    });
  };

  // Gérer les changements de langues
  const handleLanguagesChange = (newLanguages: LanguageDefinition[]) => {
    setLanguages(newLanguages);
    saveLanguagesToLocalStorage(newLanguages);
    
    // Mettre à jour les traductions du formulaire
    const newTranslations: Record<Language, string> = {};
    newLanguages.forEach(lang => {
      newTranslations[lang.id] = newGroup.translations[lang.id] || "";
    });
    
    setNewGroup(prev => ({
      ...prev,
      translations: newTranslations
    }));
  };

  // Helper to get translation by language ID
  const getTranslationForLanguage = (group: TranslationGroup, langId: Language): string => {
    return group.translations[langId] || "-";
  };

  // Réinitialiser complètement les données
  const handleResetData = () => {
    try {
      const resetGroups = resetTranslationData();
      setTranslationGroups(resetGroups);
      applySearch(resetGroups, searchTerm);
      setCategoryList(getAllCategories());
      
      toast({
        title: "Données réinitialisées",
        description: "Les données ont été réinitialisées avec succès."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la réinitialisation des données."
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-langlearn-blue-dark">Gestion des mots et traductions</h1>
        
        <Tabs defaultValue="table" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Tableau</TabsTrigger>
            <TabsTrigger value="import-export">Import / Export</TabsTrigger>
            <TabsTrigger value="languages">Langues</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Input
                  placeholder="Rechercher un mot..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full sm:w-64"
                />
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearSearch} 
                    className="h-8 flex items-center"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Effacer
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleResetData} 
                  variant="outline"
                  className="bg-amber-100 hover:bg-amber-200 text-amber-700"
                >
                  <RefreshCcw size={16} className="mr-2" /> Réinitialiser
                </Button>
                <Button 
                  onClick={() => setIsCategoryDialogOpen(true)} 
                  variant="outline"
                >
                  <Plus size={16} className="mr-2" /> Catégories
                </Button>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-langlearn-green hover:bg-langlearn-green-dark">
                  <Plus size={16} className="mr-2" /> Ajouter
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {languages.map(language => (
                      <TableHead 
                        key={language.id}
                        className="whitespace-nowrap"
                      >
                        {language.label}
                      </TableHead>
                    ))}
                    <TableHead className="w-[180px]">
                      Catégorie
                    </TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <TableRow key={group.id}>
                        {languages.map(language => (
                          <TableCell key={language.id} className="font-medium">
                            {getTranslationForLanguage(group, language.id)}
                          </TableCell>
                        ))}
                        <TableCell>
                          {getCategoryLabel(group.category)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditGroup(group)}
                            >
                              <Pen size={16} className="text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              <Trash size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={languages.length + 2} className="text-center py-8">
                        {searchTerm ? "Aucun mot trouvé pour cette recherche" : "Aucune traduction trouvée"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="import-export">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Importer des données (CSV)</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Importez des données au format CSV avec le séparateur "|". <br />
                  Format attendu: <code>category|{languages.map(l => l.id).join('|')}</code> <br />
                  Exemple: <code>FRUIT|pomme|사과|apple</code>
                </p>
                
                <div className="space-y-4">
                  <Button onClick={() => setIsImportDialogOpen(true)} className="w-full">
                    <Import size={16} className="mr-2" />
                    Importer des données CSV
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Exporter les données (CSV)</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Exportez vos données dans un format CSV compatible, séparé par le caractère "|".
                </p>
                
                <div className="space-y-4">
                  <Button onClick={handleExportCsv} className="w-full">
                    <Download size={16} className="mr-2" />
                    Exporter en CSV
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="languages">
            <LanguageManager 
              languages={languages}
              onLanguagesChange={handleLanguagesChange}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? "Modifier les traductions" : "Ajouter de nouvelles traductions"}
            </DialogTitle>
            <DialogDescription>
              Remplissez au moins une des traductions pour enregistrer le groupe.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {languages.map(language => (
              <div key={language.id} className="grid gap-2">
                <Label htmlFor={`word-${language.id}`}>{language.label}</Label>
                <Input
                  id={`word-${language.id}`}
                  value={newGroup.translations[language.id] || ''}
                  onChange={(e) => setNewGroup({
                    ...newGroup,
                    translations: {
                      ...newGroup.translations,
                      [language.id]: e.target.value
                    }
                  })}
                  placeholder={`Mot en ${language.label}`}
                />
              </div>
            ))}
            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={newGroup.category}
                onValueChange={(value) => setNewGroup({ ...newGroup, category: value as WordCategory })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveGroup} className="bg-langlearn-blue hover:bg-langlearn-blue-dark">
              {editingGroup ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategoryIndex !== null ? "Modifier une catégorie" : "Ajouter une catégorie"}
            </DialogTitle>
            <DialogDescription>
              {editingCategoryIndex !== null 
                ? "Modifiez les détails de la catégorie." 
                : "Ajoutez une nouvelle catégorie pour organiser vos mots."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="categoryId">Identifiant</Label>
              <Input
                id="categoryId"
                value={newCategory.id}
                onChange={(e) => setNewCategory({...newCategory, id: e.target.value.toUpperCase()})}
                placeholder="Identifiant unique (ex: ANIMAUX)"
                className="mt-1"
                disabled={editingCategoryIndex !== null}
              />
            </div>
            <div>
              <Label htmlFor="categoryLabel">Libellé</Label>
              <Input
                id="categoryLabel"
                value={newCategory.label}
                onChange={(e) => setNewCategory({...newCategory, label: e.target.value})}
                placeholder="Libellé affiché (ex: Animaux)"
                className="mt-1"
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Catégories existantes</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Libellé</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryList.map((category, index) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell>{category.label}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCategory(index)}
                            >
                              <Pen size={16} className="text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(index)}
                            >
                              <Trash size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNewCategory({ id: "", label: "" });
              setEditingCategoryIndex(null);
              setIsCategoryDialogOpen(false);
            }}>
              Annuler
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategoryIndex !== null ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Importer des données CSV</DialogTitle>
            <DialogDescription>
              Collez votre contenu CSV ci-dessous. Assurez-vous qu'il est au format attendu:<br />
              <code>category|{languages.map(l => l.id).join('|')}</code><br />
              <code>FRUIT|pomme|사과|apple</code>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="csvContent" className="mb-2 block">Contenu CSV</Label>
              <Textarea
                id="csvContent"
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder={`category|${languages.map(l => l.id).join('|')}\nFRUIT|pomme|사과|apple`}
                className="h-60 font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCsvContent("");
              setIsImportDialogOpen(false);
            }}>
              Annuler
            </Button>
            <Button onClick={handleImportCsv}>
              Importer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Exporter les données en CSV</DialogTitle>
            <DialogDescription>
              Voici le contenu CSV de vos données. Vous pouvez le copier ou le télécharger.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="exportedCsv" className="mb-2 block">Contenu CSV</Label>
              <Textarea
                id="exportedCsv"
                value={exportedCsv}
                readOnly
                className="h-60 font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-2 w-full justify-between">
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                Fermer
              </Button>
              <div className="flex gap-2">
                <Button onClick={handleCopyCsv} variant="outline">
                  <Copy size={16} className="mr-2" /> Copier
                </Button>
                <Button onClick={handleDownloadCsv}>
                  <Download size={16} className="mr-2" /> Télécharger
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WordsManager;
