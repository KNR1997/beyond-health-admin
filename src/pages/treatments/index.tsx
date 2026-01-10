import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import DentistList from '@/components/dentist/dentist-list';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { useDentistsQuery } from '@/data/dentist';
import { usePatientsQuery } from '@/data/patient';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Dentists() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { dentists, loading, paginatorInfo, error } = useDentistsQuery({
    language: locale,
    limit: 20,
    page,
    name: searchTerm,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <Card className="flex flex-col items-center mb-8 md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-dentists')} />
        </div>

        <div className="flex flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/2">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
          />

          {locale === Config.defaultLanguage && (
            <LinkButton
              href={Routes.dentist.create}
              className="w-full h-12 md:w-auto md:ms-6"
            >
              <span>+ {t('form:button-label-add-dentist')}</span>
            </LinkButton>
          )}
        </div>
      </Card>
      <DentistList
        dentists={dentists}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Dentists.authenticate = {
  permissions: adminOnly,
};

Dentists.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
