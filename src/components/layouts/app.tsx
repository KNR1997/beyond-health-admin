import { DENTIST, PATIENT, SUPER_ADMIN } from '@/utils/constants';
import dynamic from 'next/dynamic';
import DentistLayout from './dentist';
import PatientLayout from './patient';

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
    return <DentistLayout {...props} />;
  } else if (userPermissions?.includes(PATIENT)) {
    return <PatientLayout {...props} />
  }
  return <OwnerLayout {...props} />;
}
