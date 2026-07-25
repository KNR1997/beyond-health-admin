import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// hooks
import { useRegisterMutation, useUpdateUserMutation } from '@/data/user';
// validations
import { userValidationSchema } from './user-validation-schema';
// types
import { User } from '@/types';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import PasswordInput from '@/components/ui/password-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

type FormValues = {
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile_number: string;
};

const defaultValues = {
  display_name: '',
  email: '',
  password: '',
};

type IProps = {
  initialValues?: User;
};

export default function CreateUpdateUserForm({ initialValues }: IProps) {
  const { t } = useTranslation();
  const router = useRouter();
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // mutations
  const { mutate: registerUser, isLoading: creating } = useRegisterMutation();
  const { mutate: updateUser, isLoading: updating } = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues ? { ...initialValues } : defaultValues,
    //@ts-ignore
    resolver: yupResolver(userValidationSchema),
    context: { isEditMode: !!initialValues },
  });

  const onSubmit = async (values: FormValues) => {
    const input = {
      display_name: values.display_name,
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      password: values.password,
      mobile_number: values.mobile_number,
    };

    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };

    if (!initialValues) {
      registerUser(input, mutationOptions);
    } else {
      updateUser({
        id: initialValues.id,
        input: {
          ...input,
        },
      });
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
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:form-title-information')}
            details={t('form:user-form-info-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-display-name')}
              {...register('display_name')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.display_name?.message!)}
              required
            />
            <Input
              label={t('form:input-label-first-name')}
              {...register('first_name')}
              error={t(errors.first_name?.message!)}
              variant="outline"
              className="mb-5"
              required
            />
            <Input
              label={t('form:input-label-last-name')}
              {...register('last_name')}
              error={t(errors.last_name?.message!)}
              variant="outline"
              className="mb-5"
              required
            />
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-4"
              error={t(errors.email?.message!)}
              required
            />
            <Input
              label={t('form:input-label-contact')}
              {...register('mobile_number')}
              error={t(errors.mobile_number?.message!)}
              variant="outline"
              required
            />
            {!initialValues && (
              <div className="relative my-5">
                <PasswordInput
                  label={t('form:input-label-password')}
                  {...register('password')}
                  variant="outline"
                  error={t(errors.password?.message!)}
                  required
                />
              </div>
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
                ? t('form:button-label-update-user')
                : t('form:button-label-create-user')}
            </Button>
          </div>
          {/* <div className="mb-4 text-end">
            <Button loading={loading} disabled={loading}>
              {t('form:button-label-create-user')}
            </Button>
          </div> */}
        </StickyFooterPanel>
      </form>
    </>
  );
}
