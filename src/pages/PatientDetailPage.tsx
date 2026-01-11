import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Edit,
  Plus,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePatient, useUpdatePatient } from "@/hooks/use-patients";
import { useAppointmentsByPatient } from "@/hooks/use-appointments";
import {
  useCreateMedicalRecord,
  useUpdateMedicalRecord,
  useDeleteMedicalRecord,
} from "@/hooks/use-medical-records";
import {
  useUploadMultipleFiles,
  useDeleteFile,
  useRenameFile,
} from "@/hooks/use-medical-record-files";
import {
  PatientForm,
  PatientFormData,
} from "@/components/patients/PatientForm";
import {
  MedicalRecordForm,
  MedicalRecordFormData,
} from "@/components/medical-records/MedicalRecordForm";
import { MedicalRecordDetail } from "@/components/medical-records/MedicalRecordDetail";
import { parseDateFromAPI, formatDateForAPI } from "@/lib/date-utils";
import { toast } from "sonner";

const PatientDetailPage = () => {
  const { id } = useParams();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMedicalRecordDialog, setShowMedicalRecordDialog] = useState(false);
  const [editingMedicalRecord, setEditingMedicalRecord] = useState<
    string | null
  >(null);

  const { data: patient, isLoading: patientLoading } = usePatient(id!);
  const { data: appointmentsData, isLoading: appointmentsLoading } =
    useAppointmentsByPatient(id!);
  const updatePatientMutation = useUpdatePatient();
  const createMedicalRecordMutation = useCreateMedicalRecord();
  const updateMedicalRecordMutation = useUpdateMedicalRecord();
  const deleteMedicalRecordMutation = useDeleteMedicalRecord();
  const uploadFilesMutation = useUploadMultipleFiles();
  const deleteFileMutation = useDeleteFile();
  const renameFileMutation = useRenameFile();

  const patientAppointments = appointmentsData?.data || [];
  const isLoading = patientLoading || appointmentsLoading;

  const handleEditPatient = async (data: PatientFormData) => {
    try {
      await updatePatientMutation.mutateAsync({
        id: id!,
        data: {
          ...data,
          dateOfBirth: data.dateOfBirth || undefined,
        },
      });
      setShowEditDialog(false);
      toast.success("Patient updated successfully");
    } catch (error) {
      toast.error("Failed to update patient");
      console.error(error);
    }
  };

  const handleAddMedicalRecord = async (
    data: MedicalRecordFormData,
    files: File[]
  ) => {
    try {
      // Check if we're editing or creating
      if (editingMedicalRecord) {
        // Update existing record
        await updateMedicalRecordMutation.mutateAsync({
          id: editingMedicalRecord,
          data: {
            date: data.date,
            diagnosis: data.diagnosis,
            treatment: data.treatment,
            notes: data.notes,
          },
        });
        toast.success("Medical record updated successfully");
      } else {
        // Create new record
        const newRecord = await createMedicalRecordMutation.mutateAsync({
          patientId: id!,
          data: {
            date: data.date,
            diagnosis: data.diagnosis,
            treatment: data.treatment,
            notes: data.notes,
            attachments: data.attachments || [],
          },
        });

        // Then upload files if any
        if (files.length > 0) {
          await uploadFilesMutation.mutateAsync({
            medicalRecordId: newRecord.id,
            files: files,
          });
        }
        toast.success("Medical record added successfully");
      }

      setShowMedicalRecordDialog(false);
      setEditingMedicalRecord(null);
    } catch (error) {
      toast.error(
        editingMedicalRecord
          ? "Failed to update medical record"
          : "Failed to add medical record"
      );
      console.error(error);
    }
  };

  const handleEditMedicalRecord = (recordId: string) => {
    setEditingMedicalRecord(recordId);
    setShowMedicalRecordDialog(true);
  };

  const handleDeleteMedicalRecord = async (recordId: string) => {
    try {
      await deleteMedicalRecordMutation.mutateAsync(recordId);
      toast.success("Medical record deleted successfully");
    } catch (error) {
      toast.error("Failed to delete medical record");
      console.error(error);
    }
  };

  const handleUploadFilesToRecord = async (recordId: string, files: File[]) => {
    try {
      await uploadFilesMutation.mutateAsync({
        medicalRecordId: recordId,
        files: files,
      });
      toast.success("Files uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload files");
      console.error(error);
    }
  };

  const handleDeleteFile = async (medicalRecordId: string, fileId: string) => {
    try {
      await deleteFileMutation.mutateAsync({
        medicalRecordId,
        fileId,
      });
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Failed to delete file");
      console.error(error);
    }
  };

  const handleRenameFile = async (medicalRecordId: string, fileId: string, newName: string) => {
    try {
      await renameFileMutation.mutateAsync({
        medicalRecordId,
        fileId,
        newName,
      });
      toast.success("File renamed successfully");
    } catch (error) {
      toast.error("Failed to rename file");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">
            Loading patient details...
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!patient) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Patient not found</p>
          <Link to="/patients">
            <Button variant="outline">Back to Patients</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          to="/patients"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Link>

        {/* Patient Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary shrink-0">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {patient.name}
              </h1>
              <p className="text-muted-foreground">
                Patient since{" "}
                {format(parseDateFromAPI(patient.createdAt), "MMMM yyyy")}
              </p>
            </div>
          </div>
          <Button className="gap-2" onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4" />
            Edit Patient
          </Button>
        </div>

        {/* Contact Info Cards */}
        <div className="grid gap-4 sm:grid-cols-3 animate-slide-up">
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">
                {patient.email}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">
                {patient.phone}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-medium text-foreground">
                {patient.dateOfBirth
                  ? format(parseDateFromAPI(patient.dateOfBirth), "MMM d, yyyy")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="history" className="animate-slide-up">
          <TabsList>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Medical Records
                </h2>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowMedicalRecordDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Record
                </Button>
              </div>

              {!patient.medicalRecords ||
              patient.medicalRecords?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No medical records yet
                </p>
              ) : (
                <div className="space-y-4">
                  {patient.medicalRecords?.map((record) => (
                    <MedicalRecordDetail
                      key={record.id}
                      record={record}
                      onEdit={() => handleEditMedicalRecord(record.id)}
                      onDelete={() => handleDeleteMedicalRecord(record.id)}
                      onDeleteFile={(fileId) =>
                        handleDeleteFile(record.id, fileId)
                      }
                      onRenameFile={(fileId, newName) =>
                        handleRenameFile(record.id, fileId, newName)
                      }
                      onUploadFiles={(files) =>
                        handleUploadFilesToRecord(record.id, files)
                      }
                      uploading={uploadFilesMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Appointment History
                </h2>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Appointment
                </Button>
              </div>

              {patientAppointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No appointments scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {patientAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                    >
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {apt.type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            parseDateFromAPI(apt.date),
                            "EEEE, MMMM d, yyyy"
                          )}{" "}
                          at {apt.time}
                        </p>
                      </div>
                      <Badge
                        variant={
                          apt.status === "confirmed" ? "default" : "secondary"
                        }
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Patient Notes
              </h2>
              <p className="text-muted-foreground">
                {patient.notes || "No notes added yet."}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Patient Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          <PatientForm
            initialData={{
              name: patient.name,
              email: patient.email,
              phone: patient.phone,
              dateOfBirth: patient.dateOfBirth
                ? formatDateForAPI(parseDateFromAPI(patient.dateOfBirth))
                : "",
              address: patient.address || "",
              notes: patient.notes || "",
            }}
            onSubmit={handleEditPatient}
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add/Edit Medical Record Dialog */}
      <Dialog
        open={showMedicalRecordDialog}
        onOpenChange={(open) => {
          setShowMedicalRecordDialog(open);
          if (!open) setEditingMedicalRecord(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingMedicalRecord
                ? "Edit Medical Record"
                : "Add Medical Record"}
            </DialogTitle>
          </DialogHeader>
          <MedicalRecordForm
            onSubmit={handleAddMedicalRecord}
            onCancel={() => {
              setShowMedicalRecordDialog(false);
              setEditingMedicalRecord(null);
            }}
            initialData={
              editingMedicalRecord && patient?.medicalRecords
                ? (() => {
                    const record = patient.medicalRecords.find(
                      (r) => r.id === editingMedicalRecord
                    );
                    if (!record) return undefined;
                    return {
                      date: formatDateForAPI(parseDateFromAPI(record.date)),
                      diagnosis: record.diagnosis,
                      treatment: record.treatment,
                      notes: record.notes,
                    };
                  })()
                : undefined
            }
            isEditing={!!editingMedicalRecord}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PatientDetailPage;
