import dynamic from 'next/dynamic';
// utils
import { getAuthCredentials } from '@/utils/auth-utils';
import { DENTIST, STAFF, SUPER_ADMIN } from '@/utils/constants';
// components
const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
const OwnerLayout = dynamic(() => import('@/components/layouts/owner'));
const DentistLayout = dynamic(() => import('@/components/layouts/dentist'));
const StaffLayout = dynamic(() => import('@/components/layouts/staff'));

export default function AppLayout(props: any) {
  const { permissions } = getAuthCredentials();

  if (permissions?.includes(SUPER_ADMIN)) {
    return <AdminLayout {...props} />;
  } else if (permissions?.includes(DENTIST)) {
    return <DentistLayout {...props} />;
  } else if (permissions?.includes(STAFF)) {
    return <StaffLayout {...props} />;
  }
  return <OwnerLayout {...props} />;
}
