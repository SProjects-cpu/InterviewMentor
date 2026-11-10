import { useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectItem } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProjectsForm() {
  const { content, updateProject, deleteProject, addProject } = useResumeStore();
  const { projects } = content;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingProject({ ...projects[index] });
  };

  const handleSave = () => {
    if (editingIndex !== null && editingProject) {
      updateProject(editingIndex, editingProject);
      setEditingIndex(null);
      setEditingProject(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingProject(null);
  };

  const handleDelete = (index: number) => {
    deleteProject(index);
  };

  const addTechnology = () => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        technologies: [...editingProject.technologies, '']
      });
    }
  };

  const updateTechnology = (techIndex: number, value: string) => {
    if (editingProject) {
      const updatedTechnologies = [...editingProject.technologies];
      updatedTechnologies[techIndex] = value;
      setEditingProject({
        ...editingProject,
        technologies: updatedTechnologies
      });
    }
  };

  const removeTechnology = (techIndex: number) => {
    if (editingProject) {
      const updatedTechnologies = [...editingProject.technologies];
      updatedTechnologies.splice(techIndex, 1);
      setEditingProject({
        ...editingProject,
        technologies: updatedTechnologies
      });
    }
  };

  const addHighlight = () => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        highlights: [...editingProject.highlights, '']
      });
    }
  };

  const updateHighlight = (highlightIndex: number, value: string) => {
    if (editingProject) {
      const updatedHighlights = [...editingProject.highlights];
      updatedHighlights[highlightIndex] = value;
      setEditingProject({
        ...editingProject,
        highlights: updatedHighlights
      });
    }
  };

  const removeHighlight = (highlightIndex: number) => {
    if (editingProject) {
      const updatedHighlights = [...editingProject.highlights];
      updatedHighlights.splice(highlightIndex, 1);
      setEditingProject({
        ...editingProject,
        highlights: updatedHighlights
      });
    }
  };

  return (
    <div>
      {projects.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-4">No projects added yet.</p>
          <Button
            variant="outline"
            onClick={addProject}
          >
            <i className="ri-add-line mr-2"></i>
            Add Project
          </Button>
        </div>
      ) : (
        projects.map((project, index) => (
          <div key={project.id || index} className="p-4 group">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <i className="ri-drag-move-fill text-slate-400 mr-2 invisible group-hover:visible cursor-move"></i>
                  <h4 className="font-medium text-slate-900">{project.name}</h4>
                </div>
                <p className="text-sm text-slate-700 mt-1">{project.description}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {project.startDate && project.endDate && `${project.startDate} - ${project.endDate}`}
                  {project.startDate && !project.endDate && `${project.startDate} - Present`}
                </p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
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

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Make changes to your project information. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="month"
                  value={editingProject.startDate}
                  onChange={(e) => setEditingProject({...editingProject, startDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="month"
                  value={editingProject.endDate}
                  onChange={(e) => setEditingProject({...editingProject, endDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  type="url"
                  value={editingProject.url}
                  onChange={(e) => setEditingProject({...editingProject, url: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              {/* Technologies */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Technologies</Label>
                <div className="col-span-3 space-y-2">
                  {editingProject.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="flex gap-2">
                      <Input
                        value={tech}
                        onChange={(e) => updateTechnology(techIndex, e.target.value)}
                        placeholder="Technology name"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTechnology(techIndex)}
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
                    onClick={addTechnology}
                    className="w-full"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Technology
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
