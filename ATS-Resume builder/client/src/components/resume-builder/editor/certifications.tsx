import { useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CertificationItem } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CertificationsForm() {
  const { content, updateCertification, deleteCertification, addCertification } = useResumeStore();
  const { certifications } = content;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCertification, setEditingCertification] = useState<CertificationItem | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingCertification({ ...certifications[index] });
  };

  const handleSave = () => {
    if (editingIndex !== null && editingCertification) {
      updateCertification(editingIndex, editingCertification);
      setEditingIndex(null);
      setEditingCertification(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingCertification(null);
  };

  const handleDelete = (index: number) => {
    deleteCertification(index);
  };

  return (
    <div>
      {certifications.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-4">No certifications added yet.</p>
          <Button
            variant="outline"
            onClick={addCertification}
          >
            <i className="ri-add-line mr-2"></i>
            Add Certification
          </Button>
        </div>
      ) : (
        certifications.map((cert, index) => (
          <div key={cert.id || index} className="p-4 group">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <i className="ri-drag-move-fill text-slate-400 mr-2 invisible group-hover:visible cursor-move"></i>
                  <h4 className="font-medium text-slate-900">{cert.name}</h4>
                </div>
                <p className="text-sm text-slate-700 mt-1">{cert.issuer}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {cert.date && `Issued: ${cert.date}`}
                  {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                </p>
                {cert.credentialId && (
                  <p className="text-sm text-slate-500 mt-0.5">
                    Credential ID: {cert.credentialId}
                  </p>
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

      {/* Edit Certification Dialog */}
      {editingCertification && (
        <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Certification</DialogTitle>
              <DialogDescription>
                Make changes to your certification information. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingCertification.name}
                  onChange={(e) => setEditingCertification({...editingCertification, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issuer" className="text-right">
                  Issuer
                </Label>
                <Input
                  id="issuer"
                  value={editingCertification.issuer}
                  onChange={(e) => setEditingCertification({...editingCertification, issuer: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Issue Date
                </Label>
                <Input
                  id="date"
                  type="month"
                  value={editingCertification.date}
                  onChange={(e) => setEditingCertification({...editingCertification, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiryDate" className="text-right">
                  Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  type="month"
                  value={editingCertification.expiryDate}
                  onChange={(e) => setEditingCertification({...editingCertification, expiryDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="credentialId" className="text-right">
                  Credential ID
                </Label>
                <Input
                  id="credentialId"
                  value={editingCertification.credentialId}
                  onChange={(e) => setEditingCertification({...editingCertification, credentialId: e.target.value})}
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
                  value={editingCertification.url}
                  onChange={(e) => setEditingCertification({...editingCertification, url: e.target.value})}
                  className="col-span-3"
                />
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
