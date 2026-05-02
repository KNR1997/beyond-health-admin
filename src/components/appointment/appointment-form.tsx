import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// utils
import { getErrorMessage } from '@/utils/form-error';
// form validation
import { appointmentValidationSchema } from './appointment-validation-schema';
// types
import { Appointment, AppointmentStatus } from '@/types';
// hooks
import { useCreateAppointmentMutation, useUpdateAppointmentMutation } from '@/data/appointment';
// components
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import DatePicker from '@/components/ui/date-picker';
import Description from '@/components/ui/description';
import SelectInput from '@/components/ui/select-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

type FormValues = {
  week_start_date: Date | string;
  week_end_date: Date | string;
  status: { label: string; value: string };
};

const defaultValues = {
  week_start_date: null,
  week_end_date: null,
};

type IProps = {
  initialValues?: Appointment;
};

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

export default function CreateOrUpdateAppointmentForm({ initialValues }: IProps) {
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
          status: statusOptions?.find(
            (option) => option?.value === initialValues?.status,
          ),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(appointmentValidationSchema),
  });

  const { mutate: createAppointment, isLoading: creating } =
    useCreateAppointmentMutation();
  const { mutate: updateAppointment, isLoading: updating } =
    useUpdateAppointmentMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      status: values.status.value,
    };

    try {
      if (!initialValues) {
        createAppointment({
          ...input,
        });
      } else {
        updateAppointment({
          ...input,
          id: initialValues.id!,
        });
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
            name="appointment_date"
            minDate={today}
            // startDate={new Date(startDate)}
            placeholder="End Date"
            // toolTipText={t('form:input-tooltip-maintenance-end-time')}
            label={t('form:input-label-week-start-date')}
            // error={t(errors.week_start_date?.message!)}
            dateFormat="yyyy MMMM d"
            disabled
          />
          <div className="mb-5">
            <SelectInput
              label={t('form:input-label-status')}
              name="status"
              control={control}
              options={statusOptions}
              isClearable={true}
            />
          </div>
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
