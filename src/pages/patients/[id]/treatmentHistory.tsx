import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminAndStaffOnly } from '@/utils/auth-utils';
// types
import { SortOrder } from '@/types';
// hooks
import { usePatientTreatmentPlansQuery } from '@/data/patient';
// components
import Layout from '@/components/layouts/admin';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import PatientPageHeader from '@/components/patient/patient-page-header';
import TreatmentPlanList from '@/components/treatment-plan/treatment-plan-list';

export default function PatientTreatmentHistoryPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { treatmentPlans, loading, paginatorInfo, error } =
    usePatientTreatmentPlansQuery({
      patientId: query.id as string,
    });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <PatientPageHeader
        pageTitle="form:button-label-add-patient"
        patientId={query.id as string}
      />
      <TreatmentPlanList
        treatmentPlans={treatmentPlans}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
PatientTreatmentHistoryPage.authenticate = {
  permissions: adminAndStaffOnly,
};
PatientTreatmentHistoryPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
