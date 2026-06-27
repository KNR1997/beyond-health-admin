import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
//components
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import PatientPageHeader from '@/components/patient/patient-page-header';
import CreateOrUpdatePatientForm from '@/components/patient/patient-form';

//utils
import { adminOnly } from '@/utils/auth-utils';

//hooks
import { usePatientQuery } from '@/data/patient';


export default function UpdatePatientPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { patient, loading, error } = usePatientQuery({
    slug: query.id as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <PatientPageHeader
        pageTitle="form:button-label-add-patient"
        patientId={query.id as string}
      />
      <CreateOrUpdatePatientForm initialValues={patient} />
    </>
  );
}
UpdatePatientPage.authenticate = {
  permissions: adminOnly,
};
UpdatePatientPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
