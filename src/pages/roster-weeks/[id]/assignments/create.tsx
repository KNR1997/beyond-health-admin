import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminOnly } from '@/utils/auth-utils';
// components
import Layout from '@/components/layouts/admin';
import CreateOrUpdateRosterAssignmentForm from '@/components/roster-assignment/roster-assignment-form';

export default function CreateRosterAssignmentPage() {
  const { t } = useTranslation();
  const { query } = useRouter();

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-roster-assignment')}
        </h1>
      </div>
      <CreateOrUpdateRosterAssignmentForm rosterWeekId={query.id as string} />
    </>
  );
}

CreateRosterAssignmentPage.authenticate = {
  permissions: adminOnly,
};
CreateRosterAssignmentPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
