import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface MedicalRecordFormProps {
  onSubmit: (data: MedicalRecordFormData) => void;
  onCancel: () => void;
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
}: MedicalRecordFormProps) {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");

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
    });
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
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Medical Record</Button>
      </div>
    </form>
  );
}
