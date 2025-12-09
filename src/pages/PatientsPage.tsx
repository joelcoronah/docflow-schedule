import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PatientCard } from '@/components/patients/PatientCard';
import { PatientForm, PatientFormData } from '@/components/patients/PatientForm';
import { mockPatients } from '@/data/mockData';
import { Patient } from '@/types';
import { toast } from 'sonner';

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPatient, setShowNewPatient] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const handleNewPatient = (data: PatientFormData) => {
    const newPatient: Patient = {
      id: `p${Date.now()}`,
      ...data,
      createdAt: new Date(),
      medicalHistory: [],
    };

    setPatients([newPatient, ...patients]);
    setShowNewPatient(false);
    toast.success('Patient added successfully');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patients</h1>
            <p className="text-muted-foreground mt-1">Manage your patient records and history</p>
          </div>
          <Button onClick={() => setShowNewPatient(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 animate-slide-up">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredPatients.length} of {patients.length} patients
        </p>

        {/* Patients Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient, index) => (
            <div key={patient.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
              <PatientCard patient={patient} />
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No patients found matching your search.</p>
          </div>
        )}
      </div>

      {/* New Patient Dialog */}
      <Dialog open={showNewPatient} onOpenChange={setShowNewPatient}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <PatientForm
            onSubmit={handleNewPatient}
            onCancel={() => setShowNewPatient(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PatientsPage;
