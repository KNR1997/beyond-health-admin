import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// form-validations
import { patientValidationSchema } from './patient-validation-schema';
// hooks
import {
  useCreatePatientMutation,
  useUpdatePatientMutation,
} from '@/data/patient';
// types
import { Patient } from '@/types';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Card from '@/components/common/card';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import SelectInput from '@/components/ui/select-input';
import PhoneNumberInput from '@/components/ui/phone-input';
import ValidationError from '@/components/ui/form-validation-error';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { handleMutationError } from '@/utils/handle-mutation-error';

type FormValues = {
  name: string;
  dob: Date;
  nic: string;
  email: string;
  mobile_number: string;
  gender: { label: string; value: string };
};

const defaultValues = {
  name: '',
  email: '',
};

type IProps = {
  initialValues?: Patient;
};
export default function CreateOrUpdatePatientForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
  // mutations
  const { mutate: createPatient, isLoading: creating } =
    useCreatePatientMutation();
  const { mutate: updatePatient, isLoading: updating } =
    useUpdatePatientMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      email: values.email,
      mobile_number: values.mobile_number,
      gender: values.gender.value,
      dob: format(new Date(values.dob), 'yyyy-MM-dd'),
      nic: values.nic,
      password: values.mobile_number,
    };
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
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
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap my-5 sm:my-8">
          <Description
            title={t('form:input-label-description')}
            details={`${
              initialValues
                ? t('form:item-description-edit')
                : t('form:item-description-add')
            } ${t('form:patient-form-info-help-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-name')}
              {...register('name')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.name?.message!)}
              required
            />
            <Input
              label={t('form:input-label-dob')}
              {...register('dob')}
              type="date"
              variant="outline"
              className="mb-4"
              error={t(errors.dob?.message!)}
              required
            />
            <Input
              label={t('form:input-label-nic')}
              {...register('nic')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.nic?.message!)}
              required
            />
            <PhoneNumberInput
              label={t('form:input-label-contact')}
              {...register('mobile_number')}
              control={control}
              error={t(errors.mobile_number?.message!)}
              required
            />
            <div className="mb-5">
              <SelectInput
                label={t('form:input-label-select-gender')}
                name="gender"
                control={control}
                options={genderOptions}
                isClearable={true}
                required
              />
              <ValidationError message={t(errors.gender?.message)} />
            </div>
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-4"
              error={t(errors.email?.message!)}
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
                ? t('form:button-label-update-patient')
                : t('form:button-label-add-patient')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
