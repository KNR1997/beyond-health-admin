// hooks
import { useDeletePatientMutation } from '@/data/patient';
// components
import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';

const PatientDeleteView = () => {
  const { mutate: deletePatient, isLoading: loading } =
    useDeletePatientMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deletePatient({
      id: data,
    });
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default PatientDeleteView;
