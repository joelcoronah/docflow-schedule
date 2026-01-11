import { useState, useMemo } from "react";
import { Search, Plus, Filter, X, SortAsc } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PatientCard } from "@/components/patients/PatientCard";
import {
  PatientForm,
  PatientFormData,
} from "@/components/patients/PatientForm";
import { usePatients, useCreatePatient } from "@/hooks/use-patients";
import { toast } from "sonner";
import { Patient } from "@/types";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "date-newest"
  | "date-oldest"
  | "age-youngest"
  | "age-oldest";
type DateFilter =
  | "all"
  | "last-week"
  | "last-month"
  | "last-3-months"
  | "last-year";

const PatientsPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  // Fetch patients with search
  const { data: patientsData, isLoading } = usePatients({
    search: searchQuery || undefined,
    limit: 100,
  });

  const createPatientMutation = useCreatePatient();

  const totalPatients = patientsData?.total || 0;

  // Apply filters and sorting
  const patients = useMemo(() => {
    const rawPatients = patientsData?.data || [];
    let filtered = [...rawPatients];

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateFilter) {
        case "last-week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "last-month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "last-3-months":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "last-year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((patient) => {
        const createdAt = new Date(patient.createdAt);
        return createdAt >= cutoffDate;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date-oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "age-youngest":
          return (
            new Date(b.dateOfBirth).getTime() -
            new Date(a.dateOfBirth).getTime()
          );
        case "age-oldest":
          return (
            new Date(a.dateOfBirth).getTime() -
            new Date(b.dateOfBirth).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [patientsData?.data, sortBy, dateFilter]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (sortBy !== "name-asc") count++;
    if (dateFilter !== "all") count++;
    return count;
  }, [sortBy, dateFilter]);

  const clearFilters = () => {
    setSortBy("name-asc");
    setDateFilter("all");
  };

  const handleNewPatient = async (data: PatientFormData) => {
    try {
      await createPatientMutation.mutateAsync(data);
      setShowNewPatient(false);
      toast.success("Patient added successfully");
    } catch (error) {
      toast.error("Failed to add patient");
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("patients.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your patient records and history
            </p>
          </div>
          <Button onClick={() => setShowNewPatient(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("patients.addPatient")}
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 animate-slide-up">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search") + "..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 relative">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("patients.filters.title")}</SheetTitle>
                <SheetDescription>
                  {t("patients.filters.description")}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Sort By */}
                <div className="space-y-3">
                  <Label htmlFor="sort-by" className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4" />
                    {t("patients.filters.sortBy")}
                  </Label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger id="sort-by">
                      <SelectValue placeholder="Select sort option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">
                        {t("patients.filters.sort.nameAsc")}
                      </SelectItem>
                      <SelectItem value="name-desc">
                        {t("patients.filters.sort.nameDesc")}
                      </SelectItem>
                      <SelectItem value="date-newest">
                        {t("patients.filters.sort.dateNewest")}
                      </SelectItem>
                      <SelectItem value="date-oldest">
                        {t("patients.filters.sort.dateOldest")}
                      </SelectItem>
                      <SelectItem value="age-youngest">
                        {t("patients.filters.sort.ageYoungest")}
                      </SelectItem>
                      <SelectItem value="age-oldest">
                        {t("patients.filters.sort.ageOldest")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Added Filter */}
                <div className="space-y-3">
                  <Label htmlFor="date-filter">
                    {t("patients.filters.dateAdded")}
                  </Label>
                  <Select
                    value={dateFilter}
                    onValueChange={(value) =>
                      setDateFilter(value as DateFilter)
                    }
                  >
                    <SelectTrigger id="date-filter">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("patients.filters.dateRange.all")}
                      </SelectItem>
                      <SelectItem value="last-week">
                        {t("patients.filters.dateRange.lastWeek")}
                      </SelectItem>
                      <SelectItem value="last-month">
                        {t("patients.filters.dateRange.lastMonth")}
                      </SelectItem>
                      <SelectItem value="last-3-months">
                        {t("patients.filters.dateRange.last3Months")}
                      </SelectItem>
                      <SelectItem value="last-year">
                        {t("patients.filters.dateRange.lastYear")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium">
                        {t("patients.filters.activeFilters")}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 text-xs"
                      >
                        {t("patients.filters.clearAll")}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sortBy !== "name-asc" && (
                        <Badge variant="secondary" className="gap-1">
                          Sort: {sortBy.replace("-", " ")}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => setSortBy("name-asc")}
                          />
                        </Badge>
                      )}
                      {dateFilter !== "all" && (
                        <Badge variant="secondary" className="gap-1">
                          Date: {dateFilter.replace("-", " ")}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => setDateFilter("all")}
                          />
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          Showing {patients.length} of {totalPatients} patients
        </p>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">{t("common.loading")}</div>
          </div>
        )}

        {/* Patients Grid */}
        {!isLoading && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {patients.map((patient, index) => (
                <div
                  key={patient.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-slide-up"
                >
                  <PatientCard patient={patient} />
                </div>
              ))}
            </div>

            {patients.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No patients found matching your search.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* New Patient Dialog */}
      <Dialog open={showNewPatient} onOpenChange={setShowNewPatient}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("patients.addPatient")}</DialogTitle>
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
