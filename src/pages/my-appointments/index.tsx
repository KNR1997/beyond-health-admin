import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { dentistOnly } from '@/utils/auth-utils';
// hooks
import { useDentistMeQuery } from '@/data/dentist';
import { useAppointmentsQuery } from '@/data/appointment';
// components
import Card from '@/components/common/card';
import Layout from '@/components/layouts/dentist';
import Search from '@/components/common/search';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import PageHeading from '@/components/common/page-heading';
import MyAppointmentList from '@/components/my-appointment/appointment-list';

export default function MyAppointments() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  // states
  const [page, setPage] = useState(1);
  const [patient, setPatient] = useState('');
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  // query
  const {
    data: dentistMeData,
    isLoading: dentistMeDetailsLoading,
    error: dentistDetailsError,
  } = useDentistMeQuery();
  const { appointments, loading, paginatorInfo, error } = useAppointmentsQuery({
    language: locale,
    limit: 20,
    page,
    name: searchTerm,
    dentist: dentistMeData?.id,
    patient: patient,
    status: status,
    ordering,
  });

  if (loading || dentistMeDetailsLoading)
    return <Loader text={t('common:text-loading')} />;
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
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <PageHeading title={t('form:input-label-appointments')} />
          </div>

          <div className="flex flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/2">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />
          </div>
        </div>
      </Card>
      <MyAppointmentList
        appointments={appointments}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
    </>
  );
}

MyAppointments.authenticate = {
  permissions: dentistOnly,
};

MyAppointments.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
