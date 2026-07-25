import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminAndStaffOnly } from '@/utils/auth-utils';
// components
import Layout from '@/components/layouts/app';
import CreateOrUpdateAppointmentForm from '@/components/appointment/appointment-form';

export default function CreateAppointmentPage() {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-appointment')}
        </h1>
      </div>
      <CreateOrUpdateAppointmentForm />
    </>
  );
}

CreateAppointmentPage.authenticate = {
  permissions: adminAndStaffOnly,
};
CreateAppointmentPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
