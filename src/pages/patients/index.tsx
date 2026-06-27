import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
//components
import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import Layout from '@/components/layouts/admin';
import PatientList from '@/components/patient/patient-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';

//configs
import { Config } from '@/config';
import { usePatientsQuery } from '@/data/patient';
//types
import { SortOrder } from '@/types';
//utils
import { adminOnly } from '@/utils/auth-utils';


export default function Patients() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [ordering, setOrdering] = useState('-created_at');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { patients, loading, paginatorInfo, error } = usePatientsQuery({
    language: locale,
    limit: 20,
    page,
    name: searchTerm,
    ordering,
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
          <PageHeading title={t('form:input-label-patients')} />
        </div>

        <div className="flex flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/2">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
          />

          {locale === Config.defaultLanguage && (
            <LinkButton
              href="/patients/create"
              className="w-full h-12 md:w-auto md:ms-6"
            >
              <span>+ {t('form:button-label-add-patient')}</span>
            </LinkButton>
          )}
        </div>
      </Card>
      <PatientList
        patients={patients}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
    </>
  );
}

Patients.authenticate = {
  permissions: adminOnly,
};

Patients.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
