import { useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExperienceItem } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateRange } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";

export function ExperienceForm() {
  const { content, updateExperience, deleteExperience, addExperienceDescription } = useResumeStore();
  const { experience } = content;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [newBullet, setNewBullet] = useState<string>("");

  const handleEdit = (index: number) => {
    setEditingExperience({...experience[index]});
    setEditingIndex(index);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingExperience) {
      updateExperience(editingIndex, editingExperience);
      setEditingIndex(null);
      setEditingExperience(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingExperience(null);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      deleteExperience(deleteIndex);
      setDeleteIndex(null);
    }
  };

  const handleAddDescription = (index: number) => {
    if (newBullet.trim()) {
      addExperienceDescription(index, newBullet.trim());
      setNewBullet("");
    }
  };

  return (
    <div className="divide-y divide-slate-200">
      {experience.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-4">No work experience added yet.</p>
          <Button 
            variant="outline"
            onClick={() => useResumeStore.getState().addExperience()}
          >
            <i className="ri-add-line mr-2"></i>
            Add Work Experience
          </Button>
        </div>
      ) : (
        experience.map((exp, index) => (
          <div key={exp.id || index} className="p-4 group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center">
                  <i className="ri-drag-move-fill text-slate-400 mr-2 invisible group-hover:visible cursor-move"></i>
                  <h4 className="font-medium text-slate-900">
                    {exp.position} at {exp.company}
                  </h4>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)} {exp.location ? `• ${exp.location}` : ''}
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
            
            <div className="text-sm text-slate-600 space-y-2">
              {exp.description.map((desc, descIndex) => (
                <p key={descIndex} className="flex items-start">
                  <i className="ri-checkbox-blank-circle-fill text-[6px] text-slate-400 mt-1.5 mr-2"></i>
                  {desc}
                </p>
              ))}
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <div className="mt-3 text-xs font-medium text-primary-700 hover:text-primary-800 cursor-pointer">
                  + Add accomplishment
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Accomplishment</DialogTitle>
                  <DialogDescription>
                    Add a specific achievement or responsibility. Use action verbs and quantify results when possible.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    value={newBullet}
                    onChange={(e) => setNewBullet(e.target.value)}
                    placeholder="e.g., Increased sales by 25% through implementation of new marketing strategies"
                    rows={3}
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Tips for effective bullet points:</p>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      <li>Start with action verbs (Led, Developed, Implemented)</li>
                      <li>Include metrics and quantifiable results</li>
                      <li>Focus on achievements rather than duties</li>
                    </ul>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewBullet("")}>Cancel</Button>
                  <Button onClick={() => {
                    handleAddDescription(index);
                    document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed');
                  }}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))
      )}

      {/* Edit Experience Dialog */}
      {editingExperience && (
        <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Experience</DialogTitle>
              <DialogDescription>
                Make changes to your work experience. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Position
                </Label>
                <Input
                  id="position"
                  value={editingExperience.position}
                  onChange={(e) => setEditingExperience({...editingExperience, position: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company
                </Label>
                <Input
                  id="company"
                  value={editingExperience.company}
                  onChange={(e) => setEditingExperience({...editingExperience, company: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={editingExperience.location || ""}
                  onChange={(e) => setEditingExperience({...editingExperience, location: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="month"
                  value={editingExperience.startDate || ""}
                  onChange={(e) => setEditingExperience({...editingExperience, startDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="flex items-center space-x-2 ml-auto">
                <Checkbox
                  id="current"
                  checked={editingExperience.current || false}
                  onCheckedChange={(checked) => 
                    setEditingExperience({
                      ...editingExperience, 
                      current: !!checked,
                      endDate: !!checked ? "" : editingExperience.endDate
                    })
                  }
                />
                <Label htmlFor="current">
                  I currently work here
                </Label>
              </div>
              {!editingExperience.current && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="month"
                    value={editingExperience.endDate || ""}
                    onChange={(e) => setEditingExperience({...editingExperience, endDate: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              )}
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
              This will remove this work experience from your resume.
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
