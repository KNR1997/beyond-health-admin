import ConfirmationCard from '@/components/common/confirmation-card';
import { CheckMarkCircle } from '@/components/icons/checkmark-circle';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDentalProblemStatusChangeMutation } from '@/data/dental-problem';
import { useTranslation } from 'next-i18next';
import { CloseFillIcon } from '../icons/close-fill';

const DentalProblemStatusChangeView = () => {
  const { t } = useTranslation();
  const { mutate: StatusChange, isLoading: loading } =
    useDentalProblemStatusChangeMutation();

  const { data: modalData } = useModalState();
  const { closeModal } = useModalAction();

  async function handleDelete() {
    StatusChange(
      { id: modalData.id as string },
      {
        onSettled: () => {
          closeModal();
        },
      },
    );
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
      deleteBtnText="text-confirm"
      icon={modalData?.status ? (
        <CheckMarkCircle className="w-10 h-10 m-auto mt-4 text-accent" />
      ) : (
        <CloseFillIcon className="w-10 h-10 m-auto mt-4 text-red-600" />
      )}
      deleteBtnClassName="!bg-accent focus:outline-none hover:!bg-accent-hover focus:!bg-accent-hover"
      cancelBtnClassName="!bg-red-600 focus:outline-none hover:!bg-red-700 focus:!bg-red-700"
      title={modalData?.status ? 'text-dental-problem-activate' : 'text-dental-problem-deactive'}
      description={modalData?.status ? 'text-want-activate-dental-problem' : 'text-want-deactivate-dental-problem'}
    />
  );
};

export default DentalProblemStatusChangeView;
