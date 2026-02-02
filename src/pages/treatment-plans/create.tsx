import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminOnly } from '@/utils/auth-utils';
// components
import Layout from '@/components/layouts/admin';
import CreateOrUpdateTreatmentPlanForm from '@/components/treatment-plan/treatment-plan-form';

export default function CreateTreatmentPlanPage() {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-treatment-plan')}
        </h1>
      </div>
      <CreateOrUpdateTreatmentPlanForm />
    </>
  );
}
CreateTreatmentPlanPage.authenticate = {
  permissions: adminOnly,
};
CreateTreatmentPlanPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
