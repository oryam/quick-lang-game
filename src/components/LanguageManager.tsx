
import React, { useState } from "react";
import { Language } from "@/data/words";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pen, Trash } from "lucide-react";

export interface LanguageDefinition {
  id: Language;
  label: string;
}

interface LanguageManagerProps {
  languages: LanguageDefinition[];
  onLanguagesChange: (languages: LanguageDefinition[]) => void;
}

const LanguageManager: React.FC<LanguageManagerProps> = ({ languages, onLanguagesChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newLanguage, setNewLanguage] = useState<LanguageDefinition>({ id: 'fr' as Language, label: '' });
  const { toast } = useToast();

  const handleSaveLanguage = () => {
    if (!newLanguage.id || !newLanguage.label) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "L'identifiant et le libellé de la langue sont requis."
      });
      return;
    }

    // Vérifier si l'ID est déjà utilisé (sauf pour la langue en cours d'édition)
    const isDuplicate = editingIndex === null
      ? languages.some(lang => lang.id === newLanguage.id)
      : languages.some((lang, index) => lang.id === newLanguage.id && index !== editingIndex);

    if (isDuplicate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Cet identifiant de langue est déjà utilisé."
      });
      return;
    }

    try {
      let updatedLanguages;
      
      if (editingIndex !== null) {
        // Mise à jour d'une langue existante
        updatedLanguages = [...languages];
        updatedLanguages[editingIndex] = newLanguage;
      } else {
        // Ajout d'une nouvelle langue
        updatedLanguages = [...languages, newLanguage];
      }
      
      onLanguagesChange(updatedLanguages);
      
      setNewLanguage({ id: 'fr' as Language, label: '' });
      setEditingIndex(null);
      setIsDialogOpen(false);
      
      toast({
        title: "Langue enregistrée",
        description: "La langue a été enregistrée avec succès."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la langue."
      });
    }
  };

  const handleEditLanguage = (index: number) => {
    const language = languages[index];
    setNewLanguage({ ...language });
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteLanguage = (index: number) => {
    if (languages.length <= 1) {
      toast({
        variant: "destructive",
        title: "Suppression impossible",
        description: "Au moins une langue doit être conservée."
      });
      return;
    }

    const updatedLanguages = [...languages];
    updatedLanguages.splice(index, 1);
    
    onLanguagesChange(updatedLanguages);
    
    toast({
      title: "Langue supprimée",
      description: "La langue a été supprimée avec succès."
    });
  };

  const handleAddLanguage = () => {
    setNewLanguage({ id: 'fr' as Language, label: '' });
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestion des langues</h3>
        <Button onClick={handleAddLanguage} size="sm">
          <Plus size={16} className="mr-2" />
          Ajouter une langue
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identifiant</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {languages.map((language, index) => (
              <TableRow key={language.id}>
                <TableCell className="font-mono">{language.id}</TableCell>
                <TableCell>{language.label}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditLanguage(index)}
                    >
                      <Pen size={16} className="text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLanguage(index)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Modifier une langue" : "Ajouter une langue"}
            </DialogTitle>
            <DialogDescription>
              {editingIndex !== null 
                ? "Modifiez les détails de la langue." 
                : "Ajoutez une nouvelle langue pour vos traductions."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="languageId">Identifiant</Label>
              <Input
                id="languageId"
                value={newLanguage.id}
                onChange={(e) => setNewLanguage({...newLanguage, id: e.target.value as Language})}
                placeholder="ex: fr, en, es"
                className="mt-1 font-mono"
                maxLength={3}
              />
            </div>
            <div>
              <Label htmlFor="languageLabel">Libellé</Label>
              <Input
                id="languageLabel"
                value={newLanguage.label}
                onChange={(e) => setNewLanguage({...newLanguage, label: e.target.value})}
                placeholder="ex: Français, English, Español"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNewLanguage({ id: 'fr' as Language, label: '' });
              setEditingIndex(null);
              setIsDialogOpen(false);
            }}>
              Annuler
            </Button>
            <Button onClick={handleSaveLanguage}>
              {editingIndex !== null ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LanguageManager;
