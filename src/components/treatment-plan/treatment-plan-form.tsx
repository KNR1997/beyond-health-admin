import { useRouter } from 'next/router';
import { animateScroll } from 'react-scroll';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, FieldErrors, useForm } from 'react-hook-form';
// form-validations
import { treatmentPlanValidationSchema } from './treatment-plan-validation-schema';
// types
import { Dentist, Patient, TreatmentPlan } from '@/types';
// hooks
import { useDentistsQuery } from '@/data/dentist';
import { usePatientsQuery } from '@/data/patient';
import {
  useCreateTreatmentPlanMutation,
  useUpdateTreatmentPlanMutation,
} from '@/data/treatment-plan';
// components
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import RichTextEditor from '@/components/ui/wysiwyg-editor/editor';
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

function SelectPatient({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { patients, paginatorInfo, loading, error } = usePatientsQuery({
    limit: 20,
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

type FormValues = {
  patient: Patient;
  dentist: Dentist;
  status: { label: string; value: string };
  description: string;
};

const defaultValues = {
  name: '',
  status: '',
  description: '',
};

type IProps = {
  initialValues?: TreatmentPlan;
};

const statusOptions = [
  {
    label: 'Proposed',
    value: 'proposed',
  },
  {
    label: 'Accepted',
    value: 'accepted',
  },
  {
    label: 'In Progress',
    value: 'in_progress',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
];

export default function CreateOrUpdateTreatmentPlanForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          status: statusOptions?.find(
            (option) => option?.value === initialValues?.status,
          ),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(treatmentPlanValidationSchema),
    context: { isEditMode: !!initialValues },
  });

  const { mutate: createTreatmentPlan, isLoading: creating } =
    useCreateTreatmentPlanMutation();
  const { mutate: updateTreatmentPlan, isLoading: updating } =
    useUpdateTreatmentPlanMutation();

  const handleMutationError = (error: any) => {
    Object.keys(error?.response?.data).forEach((field: any) => {
      setError(field, {
        type: 'manual',
        message: error?.response?.data[field],
      });
    });
    animateScroll.scrollToTop();
  };

  const onSubmit = async (values: FormValues) => {
    const input = {
      patient: values.patient.id,
      dentist: values.dentist.id,
      status: values.status.value,
      description: values.description,
    };
    const mutationOptions = { onError: handleMutationError };

    if (!initialValues) {
      createTreatmentPlan(input, mutationOptions);
    } else {
      updateTreatmentPlan(
        {
          ...input,
          id: initialValues.id!,
        },
        mutationOptions,
      );
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
          } ${t('form:treatment-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <SelectPatient control={control} errors={errors} />
          <SelectDoctor control={control} errors={errors} />
          <div className="mb-5">
            <SelectInput
              label={t('form:input-label-status')}
              name="status"
              control={control}
              options={statusOptions}
              isClearable={true}
            />
          </div>
          <RichTextEditor
            title={t('form:input-description')}
            control={control}
            name={'description'}
            // error={t(
            //   errors?.page_options?.faqItems?.[index]?.description
            //     ?.message,
            // )}
            editorClassName="mb-0"
          />
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="me-4"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues
              ? t('form:button-label-update-treatment-plan')
              : t('form:button-label-add-treatment-plan')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
