import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { dentistOnly } from '@/utils/auth-utils';
// hooks
import { useAppointmentQuery } from '@/data/appointment';
// components
import Layout from '@/components/layouts/dentist';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';

export default function AppointmentDetailsPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  // query
  const { appointment, loading, error } =
    useAppointmentQuery({slug: query.id as string});

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          Appointment Details
        </h1>
      </div>

      {/* <CreateOrUpdateAppointmentForm initialValues={appointment} /> */}
    </>
  );
}

AppointmentDetailsPage.authenticate = {
  permissions: dentistOnly,
};
AppointmentDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
