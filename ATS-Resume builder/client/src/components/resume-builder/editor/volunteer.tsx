import { useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { VolunteerItem } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function VolunteerForm() {
  const { content, updateVolunteer, deleteVolunteer, addVolunteer } = useResumeStore();
  const { volunteer } = content;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerItem | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingVolunteer({ ...volunteer[index] });
  };

  const handleSave = () => {
    if (editingIndex !== null && editingVolunteer) {
      updateVolunteer(editingIndex, editingVolunteer);
      setEditingIndex(null);
      setEditingVolunteer(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingVolunteer(null);
  };

  const handleDelete = (index: number) => {
    deleteVolunteer(index);
  };

  const addDescription = () => {
    if (editingVolunteer) {
      setEditingVolunteer({
        ...editingVolunteer,
        description: [...editingVolunteer.description, '']
      });
    }
  };

  const updateDescription = (descIndex: number, value: string) => {
    if (editingVolunteer) {
      const updatedDescription = [...editingVolunteer.description];
      updatedDescription[descIndex] = value;
      setEditingVolunteer({
        ...editingVolunteer,
        description: updatedDescription
      });
    }
  };

  const removeDescription = (descIndex: number) => {
    if (editingVolunteer) {
      const updatedDescription = [...editingVolunteer.description];
      updatedDescription.splice(descIndex, 1);
      setEditingVolunteer({
        ...editingVolunteer,
        description: updatedDescription
      });
    }
  };

  return (
    <div>
      {volunteer.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-4">No volunteer experience added yet.</p>
          <Button
            variant="outline"
            onClick={addVolunteer}
          >
            <i className="ri-add-line mr-2"></i>
            Add Volunteer Experience
          </Button>
        </div>
      ) : (
        volunteer.map((vol, index) => (
          <div key={vol.id || index} className="p-4 group">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <i className="ri-drag-move-fill text-slate-400 mr-2 invisible group-hover:visible cursor-move"></i>
                  <h4 className="font-medium text-slate-900">
                    {vol.position} at {vol.organization}
                  </h4>
                </div>
                <p className="text-sm text-slate-700 mt-1">{vol.location}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {vol.startDate && vol.endDate && !vol.current && `${vol.startDate} - ${vol.endDate}`}
                  {vol.startDate && vol.current && `${vol.startDate} - Present`}
                  {vol.startDate && !vol.endDate && !vol.current && `${vol.startDate}`}
                </p>
                {vol.description.length > 0 && vol.description[0] && (
                  <ul className="text-sm text-slate-600 mt-2 space-y-1">
                    {vol.description.map((desc, descIndex) => (
                      desc && <li key={descIndex} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                )}
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

      {/* Edit Volunteer Dialog */}
      {editingVolunteer && (
        <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Volunteer Experience</DialogTitle>
              <DialogDescription>
                Make changes to your volunteer experience. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="organization" className="text-right">
                  Organization
                </Label>
                <Input
                  id="organization"
                  value={editingVolunteer.organization}
                  onChange={(e) => setEditingVolunteer({...editingVolunteer, organization: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Position
                </Label>
                <Input
                  id="position"
                  value={editingVolunteer.position}
                  onChange={(e) => setEditingVolunteer({...editingVolunteer, position: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={editingVolunteer.location}
                  onChange={(e) => setEditingVolunteer({...editingVolunteer, location: e.target.value})}
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
                  value={editingVolunteer.startDate}
                  onChange={(e) => setEditingVolunteer({...editingVolunteer, startDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Current</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="current"
                    checked={editingVolunteer.current}
                    onCheckedChange={(checked) => setEditingVolunteer({
                      ...editingVolunteer, 
                      current: checked as boolean,
                      endDate: checked ? '' : editingVolunteer.endDate
                    })}
                  />
                  <Label htmlFor="current" className="text-sm">
                    I currently volunteer here
                  </Label>
                </div>
              </div>
              {!editingVolunteer.current && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="month"
                    value={editingVolunteer.endDate}
                    onChange={(e) => setEditingVolunteer({...editingVolunteer, endDate: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              )}
              
              {/* Description */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Description</Label>
                <div className="col-span-3 space-y-2">
                  {editingVolunteer.description.map((desc, descIndex) => (
                    <div key={descIndex} className="flex gap-2">
                      <Textarea
                        value={desc}
                        onChange={(e) => updateDescription(descIndex, e.target.value)}
                        placeholder="Describe your responsibilities and achievements"
                        className="flex-1"
                        rows={2}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDescription(descIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDescription}
                    className="w-full"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Description
                  </Button>
                </div>
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
