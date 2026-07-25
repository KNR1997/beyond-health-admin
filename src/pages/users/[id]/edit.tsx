import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminOnly } from '@/utils/auth-utils';
// hooks
import { useUserQuery } from '@/data/user';
// components
import Layout from '@/components/layouts/admin';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import CreateUpdateUserForm from '@/components/user/user-form';

export default function EditUserPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { data, isLoading, error } = useUserQuery({
    id: query.id as string,
  });

  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-user')}
        </h1>
      </div>
      <CreateUpdateUserForm initialValues={data} />
    </>
  );
}

EditUserPage.authenticate = {
  permissions: adminOnly,
};
EditUserPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
