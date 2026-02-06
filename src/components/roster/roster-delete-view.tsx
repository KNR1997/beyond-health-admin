import ConfirmationCard from '@/components/common/confirmation-card';
// hooks
import { useDeleteRosterMutation } from '@/data/roster-week';
// utils
import { getErrorMessage } from '@/utils/form-error';
// components
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';

const RosterDeleteView = () => {
  const { mutate: deleteRoster, isLoading: loading } =
    useDeleteRosterMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    try {
      deleteRoster({ id: data });
      closeModal();
    } catch (error) {
      closeModal();
      getErrorMessage(error);
    }
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default RosterDeleteView;
