import { DENTIST, SUPER_ADMIN } from '@/utils/constants';
import dynamic from 'next/dynamic';
import DentistLayout from './dentist';

const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
const OwnerLayout = dynamic(() => import('@/components/layouts/owner'));

export default function AppLayout({
  userPermissions,
  ...props
}: {
  userPermissions: string[];
}) {
  if (userPermissions?.includes(SUPER_ADMIN)) {
    return <AdminLayout {...props} />;
  } else if (userPermissions?.includes(DENTIST)) {
    console.log('dentist layout')
    return <DentistLayout {...props} />;
  }
  console.log('owner layout')
  return <OwnerLayout {...props} />;
}
