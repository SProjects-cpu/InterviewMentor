import { useState, KeyboardEvent } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function SkillsForm() {
  const { content, addSkill, deleteSkill } = useResumeStore();
  const { skills } = content;
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="p-4">
      <div>
        <p className="text-sm text-slate-500 mb-2">Add skills that are relevant to the job you're applying for</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No skills added yet</p>
          ) : (
            skills.map((skill, index) => (
              <Badge 
                variant="outline" 
                key={index} 
                className="group px-2.5 py-0.5 rounded-md text-sm font-medium bg-slate-100 text-slate-800"
              >
                {skill}
                <button 
                  type="button" 
                  className="ml-1 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-500 focus:outline-none focus:bg-slate-500 focus:text-white transition-colors"
                  onClick={() => deleteSkill(index)}
                >
                  <i className="ri-close-line text-xs"></i>
                </button>
              </Badge>
            ))
          )}
        </div>
        
        <div className="relative">
          <Input
            type="text"
            className="block w-full rounded-md border-slate-300 pr-12 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <button 
              className="inline-flex items-center border border-slate-200 rounded px-2 text-xs font-medium text-slate-400"
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
