import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { patientValidationSchema } from './patient-validation-schema';
import { Patient } from '@/types';
import { animateScroll } from 'react-scroll';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import {
  useCreatePatientMutation,
  useUpdatePatientMutation,
} from '@/data/patient';

type FormValues = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: { label: string; value: string };
  password: string;
};

const defaultValues = {
  first_name: '',
  last_name: '',
  email: '',
};

type IProps = {
  initialValues?: Patient;
};
export default function CreateOrUpdatePatientDiseaseForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const genderOptions = [
    {
      label: 'Male',
      value: 'M',
    },
    {
      label: 'FeMale',
      value: 'F',
    },
  ];

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
          ...initialValues.user,
          gender: genderOptions.find(
            (genderOption) => genderOption.value == initialValues.gender,
          ),
          // ...initialValues,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(patientValidationSchema),
    context: { isEditMode: !!initialValues },
  });
  const { mutate: createPatient, isLoading: creating } =
    useCreatePatientMutation();
  const { mutate: updatePatient, isLoading: updating } =
    useUpdatePatientMutation();

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
      username: values.username,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      gender: values.gender.value,
      password: values.password,
    };
    const mutationOptions = { onError: handleMutationError };

    if (!initialValues) {
      createPatient(input, mutationOptions);
    } else {
      updatePatient(
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
          } ${t('form:patient-diseases-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />
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
              ? t('form:button-label-update-patient')
              : t('form:button-label-add-patient')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
