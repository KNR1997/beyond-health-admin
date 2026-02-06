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
import { useRosterWeeksQuery } from '@/data/roster-week';
// components
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import ErrorMessage from '@/components/ui/error-message';
import RosterList from '@/components/roster/roster-list';
import PageHeading from '@/components/common/page-heading';

export default function RosterWeeks() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  // states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  // query
  const {
    rosters,
    loading: loading,
    paginatorInfo,
    error,
  } = useRosterWeeksQuery({
    limit: 10,
    orderBy,
    sortedBy,
    name: searchTerm,
    page,
    language: locale,
  });

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
              href={`${Routes.roster.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:button-label-add-roster')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          )}
        </div>
      </Card>

      <RosterList
        rosters={rosters}
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

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
