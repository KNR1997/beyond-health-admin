import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminAndStaffOnly } from '@/utils/auth-utils';
// components
import Layout from '@/components/layouts/app';
import CreateOrUpdateDentalProblemForm from '@/components/dental-problem/dental-problem-form';

export default function CreateDentalProblemPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-dental-problem')}
        </h1>
      </div>
      <CreateOrUpdateDentalProblemForm />
    </>
  );
}

CreateDentalProblemPage.authenticate = {
  permissions: adminAndStaffOnly,
};
CreateDentalProblemPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
