import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDentistResetPasswordMutation } from '@/data/dentist';

const DentistPasswordResetView = () => {
  const { mutate: resetPassword, isLoading: loading } =
    useDentistResetPasswordMutation();
  const { data } = useModalState();

  const { closeModal } = useModalAction();

  async function handleMakeAdmin() {
    resetPassword({ dentist_id: data });
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleMakeAdmin}
      deleteBtnText="text-yes"
      title="text-make-admin"
      description="text-description-make-admin"
      deleteBtnLoading={loading}
    />
  );
};

export default DentistPasswordResetView;
