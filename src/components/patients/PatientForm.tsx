import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface PatientFormProps {
  initialData?: PatientFormData;
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
}

export interface PatientFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  notes: string;
}

export function PatientForm({ initialData, onSubmit, onCancel }: PatientFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit({
      name,
      email,
      phone,
      dateOfBirth,
      address,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main Street, City, State"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Medical Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Allergies, special conditions, preferences..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? 'Update Patient' : 'Add Patient'}</Button>
      </div>
    </form>
  );
}
