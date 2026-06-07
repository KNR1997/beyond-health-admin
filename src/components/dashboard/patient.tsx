import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
// utils
import { adminOnly, getAuthCredentials, hasAccess, patientOnly } from '@/utils/auth-utils';
// components
import PageHeading from '@/components/common/page-heading';
const ShopList = dynamic(() => import('@/components/dashboard/shops/shops'));

const PatientLayout = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-8 rounded-lg bg-light p-5 md:p-8">
        <div className="mb-7 flex items-center justify-between">
          <PageHeading title={t('text-summary')} />
        </div>
      </div>
    </>
  );
};

const PatientDashboard = () => {
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(patientOnly, permissions);

  return permission ? <ShopList /> : <PatientLayout />;
};

export default PatientDashboard;
