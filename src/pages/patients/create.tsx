import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import CreateOrUpdatePatientForm from '@/components/patient/patient-form';
import { useTranslation } from 'next-i18next';

export default function CreatePatientGeneralInfoPage() {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-patient')}
        </h1>
      </div>
      <CreateOrUpdatePatientForm />
    </>
  );
}
CreatePatientGeneralInfoPage.authenticate = {
  permissions: adminOnly,
};
CreatePatientGeneralInfoPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
