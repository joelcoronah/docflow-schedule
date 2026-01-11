import { useState } from 'react';
import { MoreVertical, Edit, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppointmentForm, AppointmentFormData } from './AppointmentForm';
import { useUpdateAppointment, useDeleteAppointment } from '@/hooks/use-appointments';
import { Appointment, Patient } from '@/types';
import { formatDateForAPI, parseDateFromAPI } from '@/lib/date-utils';
import { toast } from 'sonner';

interface AppointmentActionsProps {
  appointment: Appointment;
  patients: Patient[];
  variant?: 'default' | 'sm';
}

export function AppointmentActions({ 
  appointment, 
  patients,
  variant = 'default'
}: AppointmentActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formKey, setFormKey] = useState(0); // Force form remount on dialog open

  const updateMutation = useUpdateAppointment();
  const deleteMutation = useDeleteAppointment();

  // Open edit dialog and reset form
  const openEditDialog = () => {
    setFormKey((prev) => prev + 1); // Change key to force remount
    setShowEditDialog(true);
  };

  // Handle edit appointment
  const handleEdit = async (data: AppointmentFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: appointment.id,
        data: {
          patientId: data.patientId,
          date: formatDateForAPI(data.date),
          time: data.time,
          duration: data.duration,
          type: data.type,
          status: appointment.status,
          notes: data.notes,
        },
      });
      setShowEditDialog(false);
      toast.success('Appointment updated successfully');
    } catch (error) {
      toast.error('Failed to update appointment');
      console.error(error);
    }
  };

  // Handle cancel appointment (change status to cancelled)
  const handleCancel = async () => {
    try {
      await updateMutation.mutateAsync({
        id: appointment.id,
        data: {
          status: 'cancelled',
        },
      });
      setShowCancelDialog(false);
      toast.success('Appointment cancelled');
    } catch (error) {
      toast.error('Failed to cancel appointment');
      console.error(error);
    }
  };

  // Handle delete appointment
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(appointment.id);
      setShowDeleteDialog(false);
      toast.success('Appointment deleted');
    } catch (error) {
      toast.error('Failed to delete appointment');
      console.error(error);
    }
  };

  // Get initial form data from appointment
  const getInitialFormData = (): Partial<AppointmentFormData> => {
    return {
      patientId: appointment.patientId,
      date: parseDateFromAPI(appointment.date),
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      notes: appointment.notes,
    };
  };

  const buttonSize = variant === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const iconSize = variant === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <>
      {/* Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${buttonSize}`}
          >
            <MoreVertical className={iconSize} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={openEditDialog}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Appointment
          </DropdownMenuItem>
          
          {appointment.status !== 'cancelled' && (
            <DropdownMenuItem
              onClick={() => setShowCancelDialog(true)}
              className="cursor-pointer"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Appointment
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Appointment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            key={`${appointment.id}-${formKey}`} // Force remount on every dialog open
            patients={patients}
            onSubmit={handleEdit}
            onCancel={() => setShowEditDialog(false)}
            initialData={getInitialFormData()}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the appointment as cancelled. The appointment will still appear
              in the system but with a "cancelled" status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the appointment
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
