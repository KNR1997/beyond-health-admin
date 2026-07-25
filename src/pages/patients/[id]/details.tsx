import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { dentistOnly } from '@/utils/auth-utils';
// hooks
import { usePatientQuery } from '@/data/patient';
// components
import Layout from '@/components/layouts/app';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import PatientDetails from '@/components/patient/patient-details';
import PatientPageHeader from '@/components/patient/patient-page-header';

export default function PatientDetailsPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { patient, loading, error } = usePatientQuery({
    slug: query.id as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          Patient Details
        </h1>
      </div>
      {patient && <PatientDetails patient={patient} />}
    </>
  );
}

PatientDetailsPage.authenticate = {
  permissions: dentistOnly,
};
PatientDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
