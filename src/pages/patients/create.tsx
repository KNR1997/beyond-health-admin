import { useTranslation } from 'next-i18next';
import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import CreateOrUpdatePatientForm from '@/components/patient/patient-form';

export default function CreatePatientsPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-gray-300 pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:button-label-add-patient')}
        </h1>
      </div>
      <CreateOrUpdatePatientForm />
    </>
  );
}
CreatePatientsPage.authenticate = {
  permissions: adminOnly,
};
CreatePatientsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
