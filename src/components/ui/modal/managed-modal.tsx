import StoreNoticeDeleteView from '@/components/store-notice/store-notice-delete-view';
import Modal from '@/components/ui/modal/modal';
import dynamic from 'next/dynamic';
import { MODAL_VIEWS, useModalAction, useModalState } from './modal.context';
import TreatmentStatusChangeView from '@/components/treatment/treatment-status-change-view';
import AppointmentDeleteView from '@/components/appointment/appointment-delete-view';

const DentalProblemStatusChangeView = dynamic(
  () => import('@/components/dental-problem/dental-problem-status-change-view'),
);
const BanCustomerView = dynamic(
  () => import('@/components/user/user-ban-view'),
);
const UserWalletPointsAddView = dynamic(
  () => import('@/components/user/user-wallet-points-add-view'),
);
const MakeAdminView = dynamic(
  () => import('@/components/user/make-admin-view'),
);
const DentistPasswordResetView = dynamic(
  () => import('@/components/dentist/dentist-password-rest-view'),
);
const ShippingDeleteView = dynamic(
  () => import('@/components/shipping/shipping-delete-view'),
);
const CategoryDeleteView = dynamic(
  () => import('@/components/category/category-delete-view'),
);
const PatientDeleteView = dynamic(
  () => import('@/components/patient/patient-delete-view'),
);
const TypeDeleteView = dynamic(
  () => import('@/components/group/group-delete-view'),
);
const RosterDeleteView = dynamic(
  () => import('@/components/roster/roster-delete-view'),
);
const RosterAssignmentDeleteView = dynamic(
  () => import('@/components/roster-assignment/roster-assignment-delete-view'),
);
const UpdateRefundConfirmationView = dynamic(
  () => import('@/components/refund/refund-confirmation-view'),
);
const RefundImageModal = dynamic(
  () => import('@/components/refund/refund-image-modal'),
);
const CreateOrUpdateAddressForm = dynamic(
  () => import('@/components/address/create-or-update'),
);
const AddOrUpdateCheckoutContact = dynamic(
  () => import('@/components/checkout/contact/add-or-update'),
);
const SelectCustomer = dynamic(
  () => import('@/components/checkout/customer/select-customer'),
);
const RefundPolicyDeleteView = dynamic(
  () => import('@/components/refund-policy/refund-policy-delete-view'),
);
const RefundReasonDeleteView = dynamic(
  () => import('@/components/refund-reason/refund-reason-delete-view'),
);
const OpenAiModal = dynamic(() => import('@/components/openAI/openAI.modal'));
const ComposerMessage = dynamic(
  () => import('@/components/message/compose-message'),
);
const SearchModal = dynamic(
  () => import('@/components/layouts/topbar/search-modal'),
);
const ResetPasswordView = dynamic(
  () => import('@/components/user/reset-password-view'),
);
const DeleteOwnershipTransferRequest = dynamic(
  () =>
    import('@/components/ownership-transfer/ownership-transfer-delete-view'),
);

function renderModal(view: MODAL_VIEWS | undefined, data: any) {
  switch (view) {
    case 'DELETE_TYPE':
      return <TypeDeleteView />;
    case 'RESET_PASSWORD':
      return <ResetPasswordView />;
    case 'DELETE_CATEGORY':
      return <CategoryDeleteView />;
    case 'DELETE_PATIENT':
      return <PatientDeleteView />;
    case 'DELETE_APPOINTMENT':
      return <AppointmentDeleteView />;
    case 'DELETE_STORE_NOTICE':
      return <StoreNoticeDeleteView />;
    case 'DELETE_SHIPPING':
      return <ShippingDeleteView />;
    case 'DELETE_ROSTER_ASSIGNMENT':
      return <RosterAssignmentDeleteView />;
    case 'DELETE_ROSTER':
      return <RosterDeleteView />;
    case 'BAN_CUSTOMER':
      return <BanCustomerView />;
    case 'UPDATE_REFUND':
      return <UpdateRefundConfirmationView />;
    case 'ADD_OR_UPDATE_ADDRESS':
      return <CreateOrUpdateAddressForm />;
    case 'ADD_OR_UPDATE_CHECKOUT_CONTACT':
      return <AddOrUpdateCheckoutContact />;
    case 'REFUND_IMAGE_POPOVER':
      return <RefundImageModal />;
    case 'MAKE_ADMIN':
      return <MakeAdminView />;
    case 'RESET_DENTIST_PASSWORD':
      return <DentistPasswordResetView />;
    case 'ADD_WALLET_POINTS':
      return <UserWalletPointsAddView />;
    case 'SELECT_CUSTOMER':
      return <SelectCustomer />;
    case 'GENERATE_DESCRIPTION':
      return <OpenAiModal />;
    case 'COMPOSE_MESSAGE':
      return <ComposerMessage />;
    case 'SEARCH_VIEW':
      return <SearchModal />;
    case 'DELETE_REFUND_POLICY':
      return <RefundPolicyDeleteView />;
    case 'DELETE_REFUND_REASON':
      return <RefundReasonDeleteView />;
    case 'DENTAL_PROBLEM_STATUS_CHANGE_VIEW':
      return <DentalProblemStatusChangeView />;
    case 'TREATMENT_STATUS_CHANGE_VIEW':
      return <TreatmentStatusChangeView />;
    case 'DELETE_OWNERSHIP_TRANSFER_REQUEST':
      return <DeleteOwnershipTransferRequest />;
    default:
      return null;
  }
}

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {renderModal(view, data)}
    </Modal>
  );
};

export default ManagedModal;
