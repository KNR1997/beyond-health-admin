import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import CreateOrUpdateMedicalVitalForm from '@/components/medical-vital/medical-vital-form';

export default function CreateMedicalVitalPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-medical-vital')}
        </h1>
      </div>
      <CreateOrUpdateMedicalVitalForm />
    </>
  );
}
CreateMedicalVitalPage.authenticate = {
  permissions: adminOnly,
};
CreateMedicalVitalPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
