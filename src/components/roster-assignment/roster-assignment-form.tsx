import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, FieldErrors, useForm } from 'react-hook-form';
// utils
import { getErrorMessage } from '@/utils/form-error';
// form validation
import { rosterValidationSchema } from './roster-assignment-validation-schema';
// hooks
import { useShiftsQuery } from '@/data/shift';
import { useStaffsQuery } from '@/data/staff';
import { useRosterQuery } from '@/data/roster-week';
import { useCreateRosterAssignmentMutation } from '@/data/roster-assignment';
// types
import { Dentist, Shift, User } from '@/types';
import { useDentistsQuery } from '@/data/dentist';
// components
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Loader from '@/components/ui/loader/loader';
import DatePicker from '@/components/ui/date-picker';
import Description from '@/components/ui/description';
import SelectInput from '@/components/ui/select-input';
import ErrorMessage from '@/components/ui/error-message';
import { CalendarIcon } from '@/components/icons/calendar';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import ValidationError from '@/components/ui/form-validation-error';

function SelectDentist({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { dentists, paginatorInfo, loading, error } = useDentistsQuery({
    limit: 999,
  });
  return (
    <div className="mb-5">
      <SelectInput
        label={t('form:input-label-dentist')}
        // required
        name="dentist"
        control={control}
        isClearable={true}
        // @ts-ignore
        getOptionLabel={(option: Dentist) =>
          `${option.user?.first_name} ${option.user?.last_name}`
        }
        // @ts-ignore
        getOptionValue={(option: Dentist) => option?.user.id}
        placeholder="Select Dentist"
        options={dentists!}
        isLoading={loading}
      />
      <ValidationError message={t(errors.dentist?.message)} />
    </div>
  );
}

function SelectStaff({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { staffs, paginatorInfo, loading, error } = useStaffsQuery({
    limit: 999,
  });
  return (
    <div className="mb-5">
      <SelectInput
        label="Staff"
        // required
        name="staff"
        control={control}
        isClearable={true}
        // @ts-ignore
        getOptionLabel={(option: User) =>
          `${option?.first_name} ${option?.last_name}`
        }
        // @ts-ignore
        getOptionValue={(option: User) => option.id}
        placeholder="Select Staff"
        options={staffs!}
        isLoading={loading}
      />
      <ValidationError message={t(errors.staff?.message)} />
    </div>
  );
}

function RosterWeekInfo({ rosterWeekId }: { rosterWeekId: string }) {
  const { t } = useTranslation();
  const { roster, loading, error } = useRosterQuery({ slug: rosterWeekId });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  // Example data - replace with actual query
  const startDate = new Date(roster?.week_start_date);
  const endDate = new Date(roster?.week_end_date);

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 text-blue-800">
        <CalendarIcon className="w-5 h-5" />
        <span className="font-semibold">
          {/* {t('form:roster-week-label') || 'Roster Week'} */}
          Roster Week
        </span>
      </div>
      <div className="mt-2 text-sm text-blue-700">
        <span>
          {format(startDate, 'MMMM d, yyyy')} —{' '}
          {format(endDate, 'MMMM d, yyyy')}
        </span>
        <span className="ml-4 text-xs text-blue-500">
          ({format(startDate, 'EEE')} - {format(endDate, 'EEE')})
        </span>
      </div>
    </div>
  );
}

function SelectShift({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { shifts, loading, error } = useShiftsQuery({
    limit: 20,
  });
  return (
    <div className="my-5">
      <SelectInput
        label={t('form:input-label-shift')}
        required
        name="shift"
        control={control}
        isClearable={true}
        // @ts-ignore
        getOptionLabel={(option: Shift) => option.code}
        // @ts-ignore
        getOptionValue={(option: Shift) => option.id}
        placeholder="Select Shift"
        options={shifts!}
        isLoading={loading}
      />
      <ValidationError message={t(errors.shift?.message)} />
    </div>
  );
}

type FormValues = {
  dentist: Dentist | null;
  staff: User | null;
  shift: Shift;
  week_start_date: Date | string;
  week_end_date: Date | string;
  date: Date | string;
};

const defaultValues = {
  week_start_date: null,
  week_end_date: null,
};

type IProps = {
  rosterWeekId: string;
};

export default function CreateOrUpdateRosterAssignmentForm({
  rosterWeekId,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const today = new Date();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,

    //@ts-ignore
    defaultValues: defaultValues,
    //@ts-ignore
    resolver: yupResolver(rosterValidationSchema),
  });

  const { mutate: createRosterAssignment, isLoading: creating } =
    useCreateRosterAssignmentMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      roster_week: rosterWeekId,
      date: format(new Date(values.date), 'yyyy-MM-dd'),
      shift: values.shift.id,
      dentist: values?.dentist ? values.dentist?.user.id : null,
      staff: values.staff ? values.staff?.id : null,
    };

    try {
      createRosterAssignment({
        ...input,
      });
    } catch (err) {
      getErrorMessage(err);
    }
  };

  return (
    <>
      <RosterWeekInfo rosterWeekId={rosterWeekId} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap my-5 sm:my-8">
          <Description
            title={t('form:input-label-description')}
            details={`${t(
              'form:item-description-add',
            )} ${t('form:roster-description-helper-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <DatePicker
              required={true}
              control={control}
              name="date"
              minDate={today}
              // startDate={new Date(startDate)}
              placeholder="End Date"
              // toolTipText={t('form:input-tooltip-maintenance-end-time')}
              label={t('form:input-label-date')}
              error={t(errors.date?.message!)}
              dateFormat="yyyy MMMM d"
            />
            <SelectShift control={control} errors={errors} />
            <SelectDentist control={control} errors={errors} />
            <SelectStaff control={control} errors={errors} />
          </Card>
        </div>
        <StickyFooterPanel className="z-0">
          <div className="text-end">
            <Button
              loading={creating}
              disabled={creating}
              className="text-sm md:text-base"
            >
              {t('form:button-label-add-roster')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
