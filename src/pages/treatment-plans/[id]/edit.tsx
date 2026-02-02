import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// hooks
import { useTreatmentPlanQuery } from '@/data/treatment-plan';
// component
import Layout from '@/components/layouts/admin';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import CreateOrUpdateTreatmentPlanForm from '@/components/treatment-plan/treatment-plan-form';

export default function updateTreatmentPlanPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  // query
  const {
    treatmentPlan,
    loading,
    error,
  } = useTreatmentPlanQuery({
    slug: query.id as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-treatment-plan')}
        </h1>
      </div>

      <CreateOrUpdateTreatmentPlanForm initialValues={treatmentPlan} />
    </>
  );
}

updateTreatmentPlanPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
