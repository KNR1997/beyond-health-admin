import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// types
import { SortOrder } from '@/types';
import { useRouter } from 'next/router';
// utils
import { adminOnly } from '@/utils/auth-utils';
// config
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// hooks
import { useRosterWeekAssignmentsQuery } from '@/data/roster-week';
// components
import Layout from '@/components/layouts/admin';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import RosterPageHeader from '@/components/roster/roster-page-header';
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import PageHeading from '@/components/common/page-heading';
import RosterAssignmentList from '@/components/roster-assignment/roster-assignment-list';

export default function RosterWeeks() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  // states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  // query
  const {
    rosterAssignments,
    paginatorInfo,
    loading: loading,
    error,
  } = useRosterWeekAssignmentsQuery({ rosterWeekId: query.id as string });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <RosterPageHeader
        pageTitle="form:form-title-edit-roster"
        rosterWeekId={query.id as string}
      />
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('common:sidebar-nav-item-rosters')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-1/2 md:flex-row md:space-y-0">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
          />

          {locale === Config.defaultLanguage && (
            <LinkButton
              href={`${Routes.roster.assignmentCreate(query.id as string)}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:button-label-add-assignment')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          )}
        </div>
      </Card>

      <RosterAssignmentList
        rosterAssignments={rosterAssignments}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        paginatorInfo={paginatorInfo}
      />
    </>
  );
}

RosterWeeks.authenticate = {
  permissions: adminOnly,
};
RosterWeeks.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
