import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "./FileUploader";
import { toast } from "sonner";

interface MedicalRecordFormProps {
  onSubmit: (data: MedicalRecordFormData, files: File[]) => void;
  onCancel: () => void;
  initialData?: Partial<MedicalRecordFormData>;
  isEditing?: boolean;
}

export interface MedicalRecordFormData {
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  attachments?: string[];
}

export function MedicalRecordForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: MedicalRecordFormProps) {
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split("T")[0]
  );
  const [diagnosis, setDiagnosis] = useState(initialData?.diagnosis || "");
  const [treatment, setTreatment] = useState(initialData?.treatment || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !diagnosis || !treatment) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSubmit({
      date,
      diagnosis,
      treatment,
      notes,
    }, files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagnosis">Diagnosis *</Label>
          <Input
            id="diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter diagnosis"
            required
            maxLength={500}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="treatment">Treatment *</Label>
          <Textarea
            id="treatment"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Describe the treatment provided..."
            required
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes or observations..."
            rows={3}
          />
        </div>

        {!isEditing && (
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <FileUploader
              onFilesSelected={setFiles}
              maxFiles={5}
              maxSizeInMB={10}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Update Medical Record" : "Add Medical Record"}
        </Button>
      </div>
    </form>
  );
}
