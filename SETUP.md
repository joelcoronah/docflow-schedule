# DocFlow Schedule - Quick Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 15+ running
- Backend API running on port 3000

### Backend Setup (First Terminal)

```bash
# Navigate to backend
cd backend-services

# Install dependencies
npm install

# Configure database
# Copy .env.example to .env and update database credentials

# Start backend
npm run start:dev
```

Backend will be available at: `http://localhost:3000/api`

### Frontend Setup (Second Terminal)

```bash
# Navigate to frontend
cd docflow-schedule

# Install dependencies (if not already done)
npm install

# Start frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## ✅ Verify Integration

1. Open `http://localhost:5173` in your browser
2. Check that dashboard loads with stats
3. Try creating a new patient
4. Schedule an appointment
5. View notifications

## 📡 API Endpoints Now Integrated

### ✅ Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create patient
- `PATCH /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### ✅ Appointments
- `GET /api/appointments` - List all appointments
- `GET /api/appointments/:id` - Get appointment details
- `GET /api/appointments/patient/:patientId` - Get patient appointments
- `GET /api/appointments/date/:date` - Get appointments by date
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### ✅ Medical Records
- `GET /api/medical-records/patient/:patientId` - Get patient records
- `POST /api/medical-records/patient/:patientId` - Create record
- `GET /api/medical-records/:id` - Get record by ID
- `PATCH /api/medical-records/:id` - Update record
- `DELETE /api/medical-records/:id` - Delete record

### ✅ Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/:id` - Get notification
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### ✅ Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🔧 Configuration

### Environment Variables

Create `docflow-schedule/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

## 📂 What Was Created

### Services Layer (`src/services/`)
- `api.ts` - Base API configuration
- `patients.service.ts` - Patient API calls
- `appointments.service.ts` - Appointment API calls
- `medical-records.service.ts` - Medical records API calls
- `notifications.service.ts` - Notifications API calls
- `dashboard.service.ts` - Dashboard API calls

### React Query Hooks (`src/hooks/`)
- `use-patients.ts` - Patient data hooks
- `use-appointments.ts` - Appointment data hooks
- `use-notifications.ts` - Notification data hooks
- `use-dashboard.ts` - Dashboard data hooks

### Updated Pages
- ✅ `Index.tsx` - Dashboard with live API data
- ✅ `PatientsPage.tsx` - Patient management with API
- ✅ `PatientDetailPage.tsx` - Patient details from API
- ✅ `CalendarPage.tsx` - Calendar with real appointments
- ✅ `NotificationsPage.tsx` - Live notifications

## 🎯 Features

- ✅ Real-time data from PostgreSQL database
- ✅ Automatic cache management with React Query
- ✅ Optimistic UI updates
- ✅ Error handling and loading states
- ✅ Form validation
- ✅ Toast notifications for user feedback
- ✅ Pagination and filtering
- ✅ Search functionality

## 🐛 Troubleshooting

**Frontend can't connect to backend:**
- Check backend is running on port 3000
- Verify `VITE_API_URL` in `.env`
- Check browser console for CORS errors

**Database connection errors:**
- Verify PostgreSQL is running
- Check database credentials in `backend-services/.env`
- Ensure database exists

**Data not showing:**
- Open browser DevTools → Network tab
- Check API requests are being made
- Verify response data structure
- Check React Query DevTools (floating icon)

## 📚 Documentation

- **API Integration**: See `API_INTEGRATION.md` for detailed documentation
- **Backend API**: See `backend-services/README.md` for API reference
- **Postman Collection**: Import `backend-services/DocFlow_API.postman_collection.json`

## 🎉 Next Steps

1. Test all features in the UI
2. Create some patients
3. Schedule appointments
4. Add medical records
5. Check dashboard statistics

The application is now fully connected to the backend API! 🚀
