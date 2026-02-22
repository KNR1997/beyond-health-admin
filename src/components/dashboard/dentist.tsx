import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
// utils
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
// components
import PageHeading from '@/components/common/page-heading';
const ShopList = dynamic(() => import('@/components/dashboard/shops/shops'));

const DentistLayout = () => {
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

const DentistDashboard = () => {
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);

  return permission ? <ShopList /> : <DentistLayout />;
};

export default DentistDashboard;
