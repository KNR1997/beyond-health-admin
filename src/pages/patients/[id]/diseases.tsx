import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import PatientPageHeader from '@/components/patient/patient-page-header';
import CreateOrUpdatePatientDiseaseForm from '@/components/patient/patient-disease-form';
import { usePatientDentalProblemsQuery } from '@/data/patient-dental-problem';

export default function CreatePatientDiseasePage() {
  const { query } = useRouter();
  const { t } = useTranslation();

  const { patientDentalProblems, loading, error } =
    usePatientDentalProblemsQuery(query.id as string);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <PatientPageHeader
        pageTitle="form:button-label-add-patient"
        patientId={query.id as string}
      />
      <CreateOrUpdatePatientDiseaseForm
        initialValues={patientDentalProblems}
        patientId={query.id as string}
      />
    </>
  );
}
CreatePatientDiseasePage.authenticate = {
  permissions: adminOnly,
};
CreatePatientDiseasePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
