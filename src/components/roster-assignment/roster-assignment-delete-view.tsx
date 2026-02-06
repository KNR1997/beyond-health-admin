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
import { useDeleteRosterAssignmentMutation } from '@/data/roster-assignment';

const RosterAssignmentDeleteView = () => {
  const { mutate: deleteRosterAssignment, isLoading: loading } =
    useDeleteRosterAssignmentMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    try {
      deleteRosterAssignment({ id: data });
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

export default RosterAssignmentDeleteView;
