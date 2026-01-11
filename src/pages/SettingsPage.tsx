import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Bell, Clock, Shield, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurrentUser, UpdateUserDto } from '@/services/users.service';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { user, setAuthData } = useAuth();
  const queryClient = useQueryClient();

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialization: user?.specialization || '',
    licenseNumber: user?.licenseNumber || '',
  });

  // Password change dialog state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: (data: UpdateUserDto) => updateCurrentUser(data),
    onSuccess: (updatedUser) => {
      // Update auth context with new user data
      if (user) {
        const token = localStorage.getItem('docflow_token');
        if (token) {
          setAuthData(updatedUser, token);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('settings.profileUpdated'));
    },
    onError: (error: Error) => {
      toast.error(error.message || t('settings.profileUpdateFailed'));
    },
  });

  // Change password mutation
  const changePassword = useMutation({
    mutationFn: (password: string) => updateCurrentUser({ password }),
    onSuccess: () => {
      setIsPasswordDialogOpen(false);
      setPasswordData({ password: '', confirmPassword: '' });
      toast.success(t('settings.passwordChanged'));
    },
    onError: (error: Error) => {
      toast.error(error.message || t('settings.passwordChangeFailed'));
    },
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    updateProfile.mutate({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone || undefined,
      specialization: profileData.specialization || undefined,
      licenseNumber: profileData.licenseNumber || undefined,
    });
  };

  const handleChangePassword = () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      toast.error(t('settings.passwordsMustMatch'));
      return;
    }

    if (passwordData.password.length < 6) {
      toast.error(t('settings.passwordTooShort'));
      return;
    }

    changePassword.mutate(passwordData.password);
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('settings.subtitle')}</p>
        </div>

        {/* Profile Section */}
        <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t('settings.profile')}</h2>
              <p className="text-sm text-muted-foreground">{t('settings.profileDescription')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('users.name')} *</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                disabled={updateProfile.isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('users.email')} *</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                disabled={updateProfile.isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('users.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                disabled={updateProfile.isPending}
                placeholder="+1-555-0123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">{t('users.specialization')}</Label>
              <Input
                id="specialization"
                value={profileData.specialization}
                onChange={(e) => handleProfileChange('specialization', e.target.value)}
                disabled={updateProfile.isPending}
                placeholder={t('settings.specializationPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">{t('users.licenseNumber')}</Label>
              <Input
                id="licenseNumber"
                value={profileData.licenseNumber}
                onChange={(e) => handleProfileChange('licenseNumber', e.target.value)}
                disabled={updateProfile.isPending}
                placeholder="DEN-12345"
              />
            </div>
            <div className="pt-2">
              <Button
                onClick={handleSaveProfile}
                disabled={updateProfile.isPending}
                className="w-full sm:w-auto"
              >
                {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {t('settings.saveProfile')}
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure how you receive alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive appointment reminders via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Get text alerts for urgent matters</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Daily Summary</p>
                <p className="text-sm text-muted-foreground">Receive daily schedule overview</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Working Hours</h2>
              <p className="text-sm text-muted-foreground">Set your availability</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" defaultValue="08:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" defaultValue="18:00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slotDuration">Default Appointment Duration (minutes)</Label>
              <Input id="slotDuration" type="number" defaultValue="30" />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t('settings.security')}</h2>
              <p className="text-sm text-muted-foreground">{t('settings.securityDescription')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-medium text-foreground mb-2">{t('settings.password')}</p>
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
                {t('settings.changePassword')}
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between opacity-50 pointer-events-none">
              <div>
                <p className="font-medium text-foreground">{t('settings.twoFactor')}</p>
                <p className="text-sm text-muted-foreground">{t('settings.twoFactorDescription')}</p>
              </div>
              <Switch disabled />
            </div>
            <p className="text-xs text-muted-foreground">{t('settings.comingSoon')}</p>
          </div>
        </div>

        {/* Password Change Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('settings.changePassword')}</DialogTitle>
              <DialogDescription>
                {t('settings.changePasswordDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('settings.newPassword')} *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                  disabled={changePassword.isPending}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('settings.confirmNewPassword')} *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  disabled={changePassword.isPending}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPasswordDialogOpen(false);
                    setPasswordData({ password: '', confirmPassword: '' });
                  }}
                  disabled={changePassword.isPending}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={changePassword.isPending || !passwordData.password || !passwordData.confirmPassword}
                >
                  {changePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('settings.changePassword')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
