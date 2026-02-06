import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminOnly } from '@/utils/auth-utils';
// hooks
import { useRosterQuery } from '@/data/roster-week';
// components
import Layout from '@/components/layouts/admin';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import CreateOrUpdateRosterForm from '@/components/roster/roster-form';
import RosterPageHeader from '@/components/roster/roster-page-header';

export default function UpdateRosterWeekPage() {
  const { t } = useTranslation();
  const { query } = useRouter();

  const { roster, loading, error } = useRosterQuery({
    slug: query.id as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <RosterPageHeader
        pageTitle="form:form-title-edit-roster"
        rosterWeekId={query.id as string}
      />
      <CreateOrUpdateRosterForm initialValues={roster} />
    </>
  );
}

UpdateRosterWeekPage.authenticate = {
  permissions: adminOnly,
};
UpdateRosterWeekPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
