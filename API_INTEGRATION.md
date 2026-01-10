# API Integration Guide

This document explains how the frontend integrates with the backend API.

## 📋 Overview

The frontend uses React Query (TanStack Query) for data fetching and state management, with custom hooks for each API module.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

**Note**: Make sure the backend API is running on port 3000.

## 📁 Project Structure

```
src/
├── services/           # API service layer
│   ├── api.ts          # Base API configuration
│   ├── patients.service.ts
│   ├── appointments.service.ts
│   ├── medical-records.service.ts
│   ├── notifications.service.ts
│   └── dashboard.service.ts
├── hooks/              # React Query hooks
│   ├── use-patients.ts
│   ├── use-appointments.ts
│   ├── use-notifications.ts
│   └── use-dashboard.ts
└── pages/              # Page components using the hooks
```

## 🎣 Available Hooks

### Patients

```typescript
import {
  usePatients,      // Get all patients with search & pagination
  usePatient,       // Get single patient by ID
  useCreatePatient, // Create new patient
  useUpdatePatient, // Update patient
  useDeletePatient, // Delete patient
} from '@/hooks/use-patients';
```

**Example Usage:**

```typescript
function PatientsPage() {
  const { data, isLoading } = usePatients({ search: 'John', limit: 10 });
  const createMutation = useCreatePatient();

  const handleCreate = async (patientData) => {
    await createMutation.mutateAsync(patientData);
  };

  return (
    // Your UI here
  );
}
```

### Appointments

```typescript
import {
  useAppointments,           // Get all appointments with filters
  useAppointment,            // Get single appointment
  useAppointmentsByPatient,  // Get appointments for a patient
  useAppointmentsByDate,     // Get appointments for a date
  useCreateAppointment,      // Create appointment
  useUpdateAppointment,      // Update appointment
  useDeleteAppointment,      // Delete appointment
} from '@/hooks/use-appointments';
```

**Example Usage:**

```typescript
function CalendarPage() {
  const { data } = useAppointments({
    date: '2024-01-15',
    status: 'scheduled',
  });

  const appointments = data?.data || [];

  return (
    // Your UI here
  );
}
```

### Notifications

```typescript
import {
  useNotifications,             // Get all notifications
  useNotification,              // Get single notification
  useMarkNotificationAsRead,    // Mark as read
  useMarkAllNotificationsAsRead,// Mark all as read
  useDeleteNotification,        // Delete notification
} from '@/hooks/use-notifications';
```

### Dashboard

```typescript
import { useDashboardStats } from '@/hooks/use-dashboard';

function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div>
      <p>Today's Appointments: {stats?.todayAppointments}</p>
      <p>Total Patients: {stats?.totalPatients}</p>
    </div>
  );
}
```

## 🔄 Data Flow

1. **Component** calls React Query hook
2. **Hook** calls service function
3. **Service** makes HTTP request via `apiFetch`
4. **API** returns data
5. **React Query** caches and manages state
6. **Component** receives data and renders

## 🎨 Loading & Error States

All hooks return standard React Query states:

```typescript
const { data, isLoading, isError, error } = usePatients();

if (isLoading) return <Loading />;
if (isError) return <Error message={error.message} />;

return <div>{/* Render data */}</div>;
```

## 🔄 Mutations

Mutations automatically invalidate related queries:

```typescript
const createPatient = useCreatePatient();

// After successful mutation, patient list is automatically refetched
await createPatient.mutateAsync(newPatientData);
```

## 📡 API Services

Each service module exports functions that interact with specific endpoints:

### Patients Service

```typescript
// Get all patients
getPatients({ search?: string, page?: number, limit?: number })

// Get patient by ID
getPatientById(id: string)

// Create patient
createPatient(data: CreatePatientDto)

// Update patient
updatePatient(id: string, data: UpdatePatientDto)

// Delete patient
deletePatient(id: string)
```

### Appointments Service

```typescript
// Get appointments with filters
getAppointments({
  date?: string,
  patientId?: string,
  status?: AppointmentStatus,
  startDate?: string,
  endDate?: string,
  page?: number,
  limit?: number,
})

// Get appointment by ID
getAppointmentById(id: string)

// Get appointments by patient
getAppointmentsByPatient(patientId: string)

// Get appointments by date
getAppointmentsByDate(date: string)

// Create appointment
createAppointment(data: CreateAppointmentDto)

// Update appointment
updateAppointment(id: string, data: UpdateAppointmentDto)

// Delete appointment
deleteAppointment(id: string)
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API URL (default: http://localhost:3000/api)
```

### 3. Start Backend API

Make sure the backend is running on port 3000:

```bash
cd ../backend-services
npm run start:dev
```

### 4. Start Frontend

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🧪 Testing API Integration

1. **Start backend**: `cd backend-services && npm run start:dev`
2. **Start frontend**: `npm run dev`
3. **Open browser**: Navigate to `http://localhost:5173`
4. **Test features**:
   - View dashboard statistics
   - Browse patients list
   - Create new patient
   - Schedule appointments
   - View calendar
   - Check notifications

## 🔍 Debugging

### Check Network Requests

Open browser DevTools → Network tab to see API calls:
- Should see requests to `http://localhost:3000/api/*`
- Check request/response data
- Verify status codes (200, 201, 204, etc.)

### React Query DevTools

React Query DevTools is included. Look for the floating icon in the bottom-right corner to inspect:
- Query states
- Cached data
- Mutation states
- Refetch triggers

### Common Issues

**CORS Errors:**
- Make sure backend CORS is configured for `http://localhost:5173`
- Check `backend-services/src/main.ts` CORS settings

**Connection Refused:**
- Verify backend is running on port 3000
- Check `VITE_API_URL` in `.env`

**404 Errors:**
- Verify endpoint paths in services match backend routes
- Check backend logs for route registration

**Data Not Updating:**
- Verify mutations are configured to invalidate queries
- Check React Query cache invalidation

## 📝 Notes

- All dates are formatted as `yyyy-MM-dd` for API calls
- Times are in `HH:mm` format (24-hour)
- UUIDs are used for all entity IDs
- Pagination defaults: `page=1`, `limit=10`
- React Query automatically handles caching, refetching, and state management

## 🔄 Migration from Mock Data

The following files were updated to use real API:
- ✅ `pages/Index.tsx` - Dashboard with live stats
- ✅ `pages/PatientsPage.tsx` - Patient list and creation
- ✅ `pages/PatientDetailPage.tsx` - Patient details with appointments
- ✅ `pages/CalendarPage.tsx` - Calendar with real appointments
- ✅ `pages/NotificationsPage.tsx` - Real notifications management

Mock data (`src/data/mockData.ts`) is no longer used but kept for reference.

## 🚧 Future Enhancements

- [ ] Add authentication (JWT tokens)
- [ ] Implement optimistic updates for mutations
- [ ] Add offline support with service workers
- [ ] Implement real-time updates with WebSockets
- [ ] Add file upload for medical record attachments
- [ ] Implement advanced filtering and sorting
- [ ] Add data export functionality
- [ ] Implement search with debouncing
