import { useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EducationItem } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

export function EducationForm() {
  const { content, updateEducation, deleteEducation } = useResumeStore();
  const { education } = content;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleEdit = (index: number) => {
    setEditingEducation({...education[index]});
    setEditingIndex(index);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingEducation) {
      updateEducation(editingIndex, editingEducation);
      setEditingIndex(null);
      setEditingEducation(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingEducation(null);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      deleteEducation(deleteIndex);
      setDeleteIndex(null);
    }
  };

  return (
    <div>
      {education.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-4">No education added yet.</p>
          <Button 
            variant="outline"
            onClick={() => useResumeStore.getState().addEducation()}
          >
            <i className="ri-add-line mr-2"></i>
            Add Education
          </Button>
        </div>
      ) : (
        education.map((edu, index) => (
          <div key={edu.id || index} className="p-4 group">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <i className="ri-drag-move-fill text-slate-400 mr-2 invisible group-hover:visible cursor-move"></i>
                  <h4 className="font-medium text-slate-900">{edu.degree}</h4>
                </div>
                <p className="text-sm text-slate-700 mt-1">{edu.institution}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                </p>
              </div>
              <div className="flex space-x-1">
                <button 
                  className="text-slate-400 hover:text-slate-500 p-1"
                  onClick={() => handleEdit(index)}
                >
                  <i className="ri-edit-line"></i>
                </button>
                  <button 
                    className="text-slate-400 hover:text-slate-500 p-1"
                    onClick={() => setDeleteIndex(index)}
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Edit Education Dialog */}
      {editingEducation && (
        <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Education</DialogTitle>
              <DialogDescription>
                Make changes to your education information. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="degree" className="text-right">
                  Degree
                </Label>
                <Input
                  id="degree"
                  value={editingEducation.degree}
                  onChange={(e) => setEditingEducation({...editingEducation, degree: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="institution" className="text-right">
                  Institution
                </Label>
                <Input
                  id="institution"
                  value={editingEducation.institution}
                  onChange={(e) => setEditingEducation({...editingEducation, institution: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fieldOfStudy" className="text-right">
                  Field of Study
                </Label>
                <Input
                  id="fieldOfStudy"
                  value={editingEducation.fieldOfStudy || ""}
                  onChange={(e) => setEditingEducation({...editingEducation, fieldOfStudy: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Year
                </Label>
                <Input
                  id="startDate"
                  value={editingEducation.startDate || ""}
                  onChange={(e) => setEditingEducation({...editingEducation, startDate: e.target.value})}
                  placeholder="YYYY"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Year
                </Label>
                <Input
                  id="endDate"
                  value={editingEducation.endDate || ""}
                  onChange={(e) => setEditingEducation({...editingEducation, endDate: e.target.value})}
                  placeholder="YYYY or Present"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gpa" className="text-right">
                  GPA
                </Label>
                <Input
                  id="gpa"
                  value={editingEducation.gpa || ""}
                  onChange={(e) => setEditingEducation({...editingEducation, gpa: e.target.value})}
                  placeholder="e.g., 3.8/4.0"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this education from your resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteIndex(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
