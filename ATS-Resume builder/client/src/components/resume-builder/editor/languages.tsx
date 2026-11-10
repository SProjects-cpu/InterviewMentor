import { useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguageItem } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Native", "Fluent"] as const;

export function LanguagesForm() {
  const { content, updateLanguage, deleteLanguage, addLanguage } = useResumeStore();
  const { languages } = content;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingLanguage, setEditingLanguage] = useState<LanguageItem | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingLanguage({ ...languages[index] });
  };

  const handleSave = () => {
    if (editingIndex !== null && editingLanguage) {
      updateLanguage(editingIndex, editingLanguage);
      setEditingIndex(null);
      setEditingLanguage(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingLanguage(null);
  };

  const handleDelete = (index: number) => {
    deleteLanguage(index);
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "Native":
      case "Fluent":
        return "bg-green-100 text-green-800";
      case "Advanced":
        return "bg-blue-100 text-blue-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Beginner":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {languages.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-4">No languages added yet.</p>
          <Button
            variant="outline"
            onClick={addLanguage}
          >
            <i className="ri-add-line mr-2"></i>
            Add Language
          </Button>
        </div>
      ) : (
        languages.map((language, index) => (
          <div key={language.id || index} className="p-4 group">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <i className="ri-drag-move-fill text-slate-400 mr-2 invisible group-hover:visible cursor-move"></i>
                  <h4 className="font-medium text-slate-900">{language.language}</h4>
                </div>
                <div className="mt-2">
                  <span className={`px-2 py-1 text-xs rounded ${getProficiencyColor(language.proficiency)}`}>
                    {language.proficiency}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(index)}
                  className="h-auto py-1 px-1.5 text-slate-600 hover:text-slate-800"
                >
                  <i className="ri-edit-line"></i>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  className="h-auto py-1 px-1.5 text-red-600 hover:text-red-800"
                >
                  <i className="ri-delete-bin-line"></i>
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Edit Language Dialog */}
      {editingLanguage && (
        <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Language</DialogTitle>
              <DialogDescription>
                Make changes to your language information. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right">
                  Language
                </Label>
                <Input
                  id="language"
                  value={editingLanguage.language}
                  onChange={(e) => setEditingLanguage({...editingLanguage, language: e.target.value})}
                  className="col-span-3"
                  placeholder="e.g., Spanish, French, Mandarin"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="proficiency" className="text-right">
                  Proficiency
                </Label>
                <Select
                  value={editingLanguage.proficiency}
                  onValueChange={(value) => setEditingLanguage({
                    ...editingLanguage, 
                    proficiency: value as typeof proficiencyLevels[number]
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
