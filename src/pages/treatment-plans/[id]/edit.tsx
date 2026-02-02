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
import TreatmentPlanEditPageHeader from '@/components/treatment-plan/treatment-plan-edit-page-header';

export default function updateTreatmentPlanPage() {
  const { query } = useRouter();
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
      <TreatmentPlanEditPageHeader
        pageTitle="form:form-title-edit-treatment-plan"
        treatmentPlanId={query.id as string}
      />
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
