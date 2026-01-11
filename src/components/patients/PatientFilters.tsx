import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export interface PatientFilterOptions {
  sortBy?: 'name' | 'date' | 'age';
  sortOrder?: 'asc' | 'desc';
  ageRange?: 'all' | 'child' | 'adult' | 'senior';
  hasAppointments?: 'all' | 'yes' | 'no';
}

interface PatientFiltersProps {
  filters: PatientFilterOptions;
  onFiltersChange: (filters: PatientFilterOptions) => void;
  activeFilterCount: number;
}

export function PatientFilters({
  filters,
  onFiltersChange,
  activeFilterCount,
}: PatientFiltersProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<PatientFilterOptions>(filters);

  const handleApply = () => {
    onFiltersChange(tempFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const defaultFilters: PatientFilterOptions = {
      sortBy: 'name',
      sortOrder: 'asc',
      ageRange: 'all',
      hasAppointments: 'all',
    };
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const handleClear = () => {
    handleReset();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="gap-2 relative"
        onClick={() => setOpen(true)}
      >
        <Filter className="h-4 w-4" />
        {t('patients.filters.title')}
        {activeFilterCount > 0 && (
          <Badge
            variant="default"
            className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full"
          >
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              {t('patients.filters.title')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Sort By */}
            <div className="space-y-2">
              <Label htmlFor="sortBy">{t('patients.filters.sortBy')}</Label>
              <Select
                value={tempFilters.sortBy || 'name'}
                onValueChange={(value) =>
                  setTempFilters({
                    ...tempFilters,
                    sortBy: value as PatientFilterOptions['sortBy'],
                  })
                }
              >
                <SelectTrigger id="sortBy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">
                    {t('patients.filters.sortOptions.name')}
                  </SelectItem>
                  <SelectItem value="date">
                    {t('patients.filters.sortOptions.date')}
                  </SelectItem>
                  <SelectItem value="age">
                    {t('patients.filters.sortOptions.age')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sortOrder">
                {t('patients.filters.sortOrder')}
              </Label>
              <Select
                value={tempFilters.sortOrder || 'asc'}
                onValueChange={(value) =>
                  setTempFilters({
                    ...tempFilters,
                    sortOrder: value as PatientFilterOptions['sortOrder'],
                  })
                }
              >
                <SelectTrigger id="sortOrder">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">
                    {t('patients.filters.orderOptions.asc')}
                  </SelectItem>
                  <SelectItem value="desc">
                    {t('patients.filters.orderOptions.desc')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Range */}
            <div className="space-y-2">
              <Label htmlFor="ageRange">
                {t('patients.filters.ageRange')}
              </Label>
              <Select
                value={tempFilters.ageRange || 'all'}
                onValueChange={(value) =>
                  setTempFilters({
                    ...tempFilters,
                    ageRange: value as PatientFilterOptions['ageRange'],
                  })
                }
              >
                <SelectTrigger id="ageRange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t('patients.filters.ageOptions.all')}
                  </SelectItem>
                  <SelectItem value="child">
                    {t('patients.filters.ageOptions.child')} (0-17)
                  </SelectItem>
                  <SelectItem value="adult">
                    {t('patients.filters.ageOptions.adult')} (18-64)
                  </SelectItem>
                  <SelectItem value="senior">
                    {t('patients.filters.ageOptions.senior')} (65+)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Has Appointments */}
            <div className="space-y-2">
              <Label htmlFor="hasAppointments">
                {t('patients.filters.appointments')}
              </Label>
              <Select
                value={tempFilters.hasAppointments || 'all'}
                onValueChange={(value) =>
                  setTempFilters({
                    ...tempFilters,
                    hasAppointments:
                      value as PatientFilterOptions['hasAppointments'],
                  })
                }
              >
                <SelectTrigger id="hasAppointments">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t('patients.filters.appointmentOptions.all')}
                  </SelectItem>
                  <SelectItem value="yes">
                    {t('patients.filters.appointmentOptions.yes')}
                  </SelectItem>
                  <SelectItem value="no">
                    {t('patients.filters.appointmentOptions.no')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleClear}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              {t('patients.filters.clear')}
            </Button>
            <Button onClick={handleApply}>{t('patients.filters.apply')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
