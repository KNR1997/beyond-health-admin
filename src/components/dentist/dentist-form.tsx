import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// validations
import { dentistValidationSchema } from './dentist-validation-schema';
// types
import { Dentist } from '@/types';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// hooks
import {
  useCreateDentistMutation,
  useUpdateDentistMutation,
} from '@/data/dentist';
// components
import Input from '@/components/ui/input';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import SelectInput from '@/components/ui/select-input';
import PasswordInput from '@/components/ui/password-input';
import PhoneNumberInput from '@/components/ui/phone-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import ValidationError from '@/components/ui/form-validation-error';

type FormValues = {
  name: string;
  first_name: string;
  last_name: string;
  license_number: string;
  email: string;
  mobile_number: string;
  specialization: { label: string; value: string };
  gender: { label: string; value: string };
  password: string;
};

const defaultValues = {
  name: '',
  email: '',
};

type IProps = {
  initialValues?: Dentist;
};
export default function CreateOrUpdateDentistForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const specializationOptions = [
    {
      label: 'General Dentistry',
      value: 'general',
    },
    {
      label: 'Orthodontics',
      value: 'ortho',
    },
    {
      label: 'Periodontics',
      value: 'perio',
    },
    {
      label: 'Endodontics',
      value: 'endo',
    },
    {
      label: 'Pedodontics',
      value: 'pedo',
    },
    {
      label: 'Oral Surgery',
      value: 'oral_surgery',
    },
    {
      label: 'Prosthodontics',
      value: 'prostho',
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
        specialization: specializationOptions.find(
          (genderOption) =>
            genderOption.value == initialValues.specialization,
        ),
        // ...initialValues,
      }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(dentistValidationSchema),
    context: { isEditMode: !!initialValues },
  });
  const { mutate: createDentist, isLoading: creating } =
    useCreateDentistMutation();
  const { mutate: updateDentist, isLoading: updating } =
    useUpdateDentistMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      mobile_number: values.mobile_number,
      password: values.password,
      license_number: values.license_number,
      specialization: values.specialization.value,
    };
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    if (!initialValues) {
      createDentist(input, mutationOptions);
    } else {
      updateDentist(
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
            details={`${initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
              } ${t('form:patient-form-info-help-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-first-name')}
              {...register('first_name')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.first_name?.message!)}
              required
            />
            <Input
              label={t('form:input-label-last-name')}
              {...register('last_name')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.last_name?.message!)}
              required
            />
            <Input
              label={t('form:input-label-license-number')}
              {...register('license_number')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.license_number?.message!)}
              required
            />
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-4"
              error={t(errors.email?.message!)}
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
                required
                label={t('form:input-label-select-specification')}
                name="specialization"
                control={control}
                options={specializationOptions}
                isClearable={true}
              />
              <ValidationError message={t(errors.specialization?.message)} />
            </div>
            {/* <div className="mb-5">
            <SelectInput
              label={t('form:input-label-select-gender')}
              name="gender"
              control={control}
              options={genderOptions}
              isClearable={true}
            />
            <ValidationError message={t(errors.gender?.message)} />
          </div> */}
            {!initialValues && (
              <PasswordInput
                label={t('form:input-label-password')}
                type="password"
                {...register('password')}
                error={t(errors.password?.message!)}
                variant="outline"
                className="mb-5"
                required
              />
            )}
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
                ? t('form:button-label-update-dentist')
                : t('form:button-label-add-dentist')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
