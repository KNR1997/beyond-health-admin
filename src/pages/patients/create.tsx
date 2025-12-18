import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import CreateOrUpdatePatientForm from '@/components/patient/patient-form';
import PatientPageHeader from '@/components/patient/patient-page-header';

export default function CreatePatientGeneralInfoPage() {
  return (
    <>
      <PatientPageHeader pageTitle="form:button-label-add-patient" />
      <CreateOrUpdatePatientForm />
    </>
  );
}
CreatePatientGeneralInfoPage.authenticate = {
  permissions: adminOnly,
};
CreatePatientGeneralInfoPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
