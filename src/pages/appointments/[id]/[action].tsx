import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCategoryQuery } from '@/data/category';
//components
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import CreateOrUpdateDentistForm from '@/components/dentist/dentist-form';
import CreateOrUpdateCategoriesForm from '@/components/category/category-form';
//configs
import { Config } from '@/config';
//hooks
import { useDentistQuery } from '@/data/dentist';
import CreateOrUpdateAppointmentForm from '@/components/appointment/appointment-form';
import { useAppointmentQuery } from '@/data/appointment';

export default function UpdateAppointmentPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    appointment,
    loading,
    error,
  } = useAppointmentQuery({
    slug: query.id as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-appointment')}
        </h1>
      </div>

      <CreateOrUpdateAppointmentForm initialValues={appointment} />
    </>
  );
}

UpdateAppointmentPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
