import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, FieldErrors, useForm } from 'react-hook-form';
// utils
import { getErrorMessage } from '@/utils/form-error';
// form validation
import { appointmentValidationSchema } from './appointment-validation-schema';
// types
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  Dentist,
  Patient,
} from '@/types';
// hooks
import {
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
} from '@/data/appointment';
import { usePatientsQuery } from '@/data/patient';
import { useDentistsQuery } from '@/data/dentist';
// components
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import DatePicker from '@/components/ui/date-picker';
import Description from '@/components/ui/description';
import SelectInput from '@/components/ui/select-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import ValidationError from '@/components/ui/form-validation-error';

function SelectPatient({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { patients, loading } = usePatientsQuery({
    limit: 999,
  });
  return (
    <div className="mb-5">
      <SelectInput
        label={t('form:input-label-patient')}
        required
        name="patient"
        control={control}
        // @ts-ignore
        getOptionLabel={(option: Patient) => `${option.name}`}
        // @ts-ignore
        getOptionValue={(option: Patient) => option.id}
        options={patients!}
        isLoading={loading}
        isClearable={true}
      />
      <ValidationError message={t(errors.patient?.message)} />
    </div>
  );
}

function SelectDoctor({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { dentists, loading } = useDentistsQuery({
    limit: 999,
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

type FormValues = {
  patient: Patient;
  dentist: Dentist;
  appointment_date: Date;
  type: { label: string; value: string };
  status: { label: string; value: string };
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

const appointmentTypeOptions = [
  {
    label: 'Checkup',
    value: AppointmentType.Checkup,
  },
  {
    label: 'Cleaning',
    value: AppointmentType.Cleaning,
  },
  {
    label: 'Filling',
    value: AppointmentType.Filling,
  },
];

const defaultValues = {
  type: null,
  status: {
    label: 'Scheduled',
    value: AppointmentStatus.SCHEDULED,
  },
};

type IProps = {
  initialValues?: Appointment;
};

export default function CreateOrUpdateAppointmentForm({
  initialValues,
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
          status: statusOptions?.find(
            (option) => option?.value === initialValues?.status,
          ),
          appointment_date: new Date(initialValues.appointment_date),
          type: appointmentTypeOptions?.find(
            (option) => option?.value === initialValues?.appointment_type,
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
      patient: values.patient.id,
      dentist: values.dentist.id,
      appointment_date: format(values.appointment_date, 'yyyy-MM-dd HH:mm:ss'),
      appointment_type: values.type.value,
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
          } ${t('form:appointment-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <SelectPatient control={control} errors={errors} />
          <SelectDoctor control={control} errors={errors} />

          <DatePicker
            required={true}
            control={control}
            name="appointment_date"
            minDate={today}
            placeholder="Select Date & Time"
            label="Appointment Date & Time"
            error={t(errors.appointment_date?.message!)}
            dateFormat="MMMM d, yyyy h:mm aa"
            showTimeSelect={true}
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            filterTime={(time: Date) => {
              const hours = time.getHours();
              // Only allow appointments between 9 AM and 6 PM
              return hours >= 9 && hours < 18;
            }}
          />
          <div className="mb-5">
            <SelectInput
              label="Appointment Type"
              name="type"
              control={control}
              options={appointmentTypeOptions}
              isClearable={true}
              required
              error={t(errors.type?.message!)}
            />
          </div>
          <div className="mb-5">
            <SelectInput
              label="Appointment Status"
              name="status"
              control={control}
              options={statusOptions}
              isClearable={true}
              required
              error={t(errors.status?.message!)}
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
              ? t('form:button-label-update-appointment')
              : t('form:button-label-add-appointment')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
