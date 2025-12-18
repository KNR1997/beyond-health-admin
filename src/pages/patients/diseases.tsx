import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import PatientPageHeader from '@/components/patient/patient-page-header';
import CreateOrUpdatePatientDiseaseForm from '@/components/patient/patient-disease-form';

export default function CreatePatientDiseasePage() {
  return (
    <>
      <PatientPageHeader pageTitle="form:button-label-add-patient" />
      <CreateOrUpdatePatientDiseaseForm />
    </>
  );
}
CreatePatientDiseasePage.authenticate = {
  permissions: adminOnly,
};
CreatePatientDiseasePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
