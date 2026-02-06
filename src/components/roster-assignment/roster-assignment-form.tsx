import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// utils
import { getErrorMessage } from '@/utils/form-error';
// form validation
import { rosterValidationSchema } from './roster-assignment-validation-schema';
// hooks
import { useSettingsQuery } from '@/data/settings';
import { useUpdateRosterMutation } from '@/data/roster-week';
import { useShiftsQuery } from '@/data/shift';
import { useCreateRosterAssignmentMutation } from '@/data/roster-assignment';
// types
import { Dentist, Shift } from '@/types';
import { useDentistsQuery } from '@/data/dentist';
// components
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import DatePicker from '@/components/ui/date-picker';

function SelectDentist({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { dentists, paginatorInfo, loading, error } = useDentistsQuery({
    limit: 20,
  });
  return (
    <div className="mb-5">
      <SelectInput
        label={t('form:input-label-dentist')}
        required
        name="dentist"
        control={control}
        isClearable={true}
        // @ts-ignore
        getOptionLabel={(option: Dentist) =>
          `${option.user?.first_name} ${option.user?.last_name}`
        }
        // @ts-ignore
        getOptionValue={(option: Dentist) => option.id}
        options={dentists!}
        isLoading={loading}
      />
      <ValidationError message={t(errors.dentist?.message)} />
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
  console.log('shifts----------: ', shifts);
  return (
    <div className="mb-5">
      <SelectInput
        label={t('form:input-label-dentist')}
        required
        name="shift"
        control={control}
        isClearable={true}
        // @ts-ignore
        getOptionLabel={(option: Shift) => option.code}
        // @ts-ignore
        getOptionValue={(option: Shift) => option.id}
        options={shifts!}
        isLoading={loading}
      />
      <ValidationError message={t(errors.shift?.message)} />
    </div>
  );
}

type FormValues = {
  dentist: Dentist;
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
  initialValues?: any;
  rosterWeekId: string;
};

export default function CreateOrUpdateRosterAssignmentForm({
  initialValues,
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
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(rosterValidationSchema),
  });

  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const { mutate: createRosterAssignment, isLoading: creating } =
    useCreateRosterAssignmentMutation();
  const { mutate: updateRoster, isLoading: updating } =
    useUpdateRosterMutation();

  const onSubmit = async (values: FormValues) => {
    console.log('values---------: ', values);
    const input = {
      roster_week: rosterWeekId,
      date: format(new Date(values.date), 'yyyy-MM-dd'),
      user: values.dentist.user.id,
      shift: values.shift.id,
      assigned_role: 'DENTIST',
    };

    try {
      if (!initialValues) {
        createRosterAssignment({
          ...input,
        });
      } else {
        // updateRoster({
        //   ...input,
        //   id: initialValues.id!,
        // });
      }
    } catch (err) {
      getErrorMessage(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:roster-description-helper-text')}`}
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
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="text-sm me-4 md:text-base"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
            className="text-sm md:text-base"
          >
            {initialValues
              ? t('form:button-label-update-roster')
              : t('form:button-label-add-roster')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
