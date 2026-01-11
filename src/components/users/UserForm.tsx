import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { User, CreateUserDto, UpdateUserDto } from '@/services/users.service';
import { useTranslation } from 'react-i18next';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    role: 'doctor' as 'doctor' | 'admin',
    isActive: true,
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Don't pre-fill password
        phone: user.phone || '',
        specialization: user.specialization || '',
        licenseNumber: user.licenseNumber || '',
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      // Update: only send changed fields
      const updateData: UpdateUserDto = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        specialization: formData.specialization || undefined,
        licenseNumber: formData.licenseNumber || undefined,
        role: formData.role,
        isActive: formData.isActive,
      };
      
      // Only include password if it's been changed
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      onSubmit(updateData);
    } else {
      // Create: all required fields
      const createData: CreateUserDto = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        specialization: formData.specialization || undefined,
        licenseNumber: formData.licenseNumber || undefined,
        role: formData.role,
      };
      
      onSubmit(createData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">{t('users.name')} *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          disabled={isLoading}
          placeholder="Dr. John Doe"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">{t('users.email')} *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
          disabled={isLoading}
          placeholder="doctor@example.com"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">
          {t('users.password')} {!user && '*'}
          {user && <span className="text-xs text-gray-500"> ({t('users.leaveBlankToKeep')})</span>}
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          required={!user}
          disabled={isLoading}
          placeholder="••••••••"
          minLength={6}
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">{t('users.phone')}</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          disabled={isLoading}
          placeholder="+1-555-0123"
        />
      </div>

      {/* Specialization */}
      <div className="space-y-2">
        <Label htmlFor="specialization">{t('users.specialization')}</Label>
        <Input
          id="specialization"
          value={formData.specialization}
          onChange={(e) => handleChange('specialization', e.target.value)}
          disabled={isLoading}
          placeholder="General Dentistry"
        />
      </div>

      {/* License Number */}
      <div className="space-y-2">
        <Label htmlFor="licenseNumber">{t('users.licenseNumber')}</Label>
        <Input
          id="licenseNumber"
          value={formData.licenseNumber}
          onChange={(e) => handleChange('licenseNumber', e.target.value)}
          disabled={isLoading}
          placeholder="DEN-12345"
        />
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">{t('users.role')} *</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleChange('role', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doctor">{t('users.roles.doctor')}</SelectItem>
            <SelectItem value="admin">{t('users.roles.admin')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Status (only show when editing) */}
      {user && (
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="isActive">{t('users.active')}</Label>
            <p className="text-sm text-gray-500">
              {t('users.activeDescription')}
            </p>
          </div>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => handleChange('isActive', checked)}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {user ? t('common.save') : t('users.createUser')}
        </Button>
      </div>
    </form>
  );
}
