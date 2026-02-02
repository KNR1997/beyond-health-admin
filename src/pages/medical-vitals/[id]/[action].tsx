import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import { useMedicalVitalQuery } from '@/data/medical-vital';
import CreateOrUpdateMedicalVitalForm from '@/components/medical-vital/medical-vital-form';

export default function UpdateMedicalVitalPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { medicalVital, loading, error } = useMedicalVitalQuery({
    slug: query.id as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex pb-5 border-b border-dashed border-border-base md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-medical-vital')}
        </h1>
      </div>
      <CreateOrUpdateMedicalVitalForm initialValues={medicalVital} />
    </>
  );
}

UpdateMedicalVitalPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
