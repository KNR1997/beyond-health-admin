import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// hooks
import { useTreatmentPlanItemsQuery } from '@/data/treatment-plan';
// component
import Layout from '@/components/layouts/admin';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import TreatmentPlanEditPageHeader from '@/components/treatment-plan/treatment-plan-edit-page-header';
import CreateOrUpdateTreatmenPlanItemsForm from '@/components/treatment-plan/treatment-plan-items-form';

export default function UpdateTreatmentPlanItemsPage() {
  const { query } = useRouter();
  const { t } = useTranslation();

  const { treatmentPlanItems, loading, error } = useTreatmentPlanItemsQuery({
    treatmentPlanId: query.id as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <TreatmentPlanEditPageHeader
        pageTitle="form:form-title-edit-treatment-plan"
        treatmentPlanId={query.id as string}
      />
      {treatmentPlanItems && (
        <CreateOrUpdateTreatmenPlanItemsForm
          treatmentPlanId={query.id as string}
          initialValues={treatmentPlanItems}
        />
      )}
    </>
  );
}

UpdateTreatmentPlanItemsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
