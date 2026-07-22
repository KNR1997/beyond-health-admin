import cn from 'classnames';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { ActionMeta } from 'react-select';
// hooks
import { useDentistsQuery } from '@/data/dentist';
import { usePatientsQuery } from '@/data/patient';
import { AppointmentStatus, Dentist } from '@/types';
// components
import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';
import DatePicker from '@/components/ui/date-picker';

type Props = {
  onPatientFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onDentistFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onStatusFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onDateRangeFilter?: (startDate: Date | null, endDate: Date | null) => void;
  className?: string;
  type?: string;
  enablePatient?: boolean;
  enableDentist?: boolean;
  enableStatus?: boolean;
  enableDateRange?: boolean;
};

type FilterFormValues = {
  startDate: Date | null;
  endDate: Date | null;
};

export default function AppointmentFilter({
  onPatientFilter,
  onDentistFilter,
  onStatusFilter,
  onDateRangeFilter,
  className,
  enablePatient,
  enableDentist,
  enableStatus,
  enableDateRange = false,
}: Props) {
  const { locale } = useRouter();
  const { control, watch } = useForm<FilterFormValues>({
    defaultValues: {
      startDate: null,
      endDate: null,
    },
  });

  const { patients, loading: patientLoading } = usePatientsQuery({
    limit: 999,
    language: locale,
  });

  const { dentists, loading: dentistLoading } = useDentistsQuery({
    limit: 999,
    language: locale,
  });

  // Watch for date changes
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Trigger filter when dates change
  useEffect(() => {
    if (onDateRangeFilter) {
      onDateRangeFilter(startDate, endDate);
    }
  }, [startDate, endDate, onDateRangeFilter]);

  const statusOptions = [
    {
      label: 'Scheduled',
      value: AppointmentStatus.SCHEDULED,
    },
    {
      label: 'Confirmed',
      value: AppointmentStatus.CONFIRMED,
    },
    {
      label: 'In Progress',
      value: AppointmentStatus.IN_PROGRESS,
    },
    {
      label: 'Completed',
      value: AppointmentStatus.COMPLETED,
    },
    {
      label: 'Cancelled',
      value: AppointmentStatus.CANCELLED,
    },
    {
      label: 'No Show',
      value: AppointmentStatus.NO_SHOW,
    },
  ];

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className,
      )}
    >
      {enablePatient && (
        <div className="w-full">
          <Label>Filter By Patient</Label>
          <Select
            options={patients}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.id}
            placeholder="Filter By Patient"
            isLoading={patientLoading}
            onChange={onPatientFilter}
            isClearable={true}
          />
        </div>
      )}

      {enableDentist && (
        <div className="w-full">
          <Label>Filter By Dentist</Label>
          <Select
            options={dentists}
            // @ts-ignore
            getOptionLabel={(option: Dentist) =>
              `${option.user?.first_name} ${option.user?.last_name}`
            }
            // @ts-ignore
            getOptionValue={(option: Dentist) => option.slug}
            placeholder="Filter By Dentist"
            isLoading={dentistLoading}
            onChange={onDentistFilter}
            isClearable={true}
          />
        </div>
      )}

      {enableStatus && (
        <div className="w-full">
          <Label>Filter by Status</Label>
          <Select
            options={statusOptions}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.value}
            placeholder="Filter by Status"
            onChange={onStatusFilter}
            isClearable={true}
          />
        </div>
      )}

      {enableDateRange && (
        <div className="w-full">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>From Date</Label>
              <DatePicker
                control={control}
                name="startDate"
                placeholder="Start Date"
                dateFormat="MMM d, yyyy"
              />
            </div>
            <div>
              <Label>To Date</Label>
              <DatePicker
                control={control}
                name="endDate"
                placeholder="End Date"
                dateFormat="MMM d, yyyy"
                minDate={startDate || undefined} // Prevent end date before start date
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
