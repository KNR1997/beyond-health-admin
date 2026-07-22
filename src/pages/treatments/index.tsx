import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// configs
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// utils
import { adminOnly } from '@/utils/auth-utils';
// hooks
import { useTreatmentsQuery } from '@/data/treatment';
// components
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import Layout from '@/components/layouts/admin';
import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import ErrorMessage from '@/components/ui/error-message';
import PageHeading from '@/components/common/page-heading';
import TreatmentList from '@/components/treatment/treatment-list';
import Button from '@/components/ui/button';
import { DownloadIcon } from '@/components/icons/download-icon';
import { toast } from 'react-toastify';
import { reportClient } from '@/data/client/report';

export default function Treatments() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  // states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  // query
  const { treatments, loading, paginatorInfo, error } = useTreatmentsQuery({
    language: locale,
    limit: 20,
    page,
    name: searchTerm,
    ordering,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  async function handleDownloadInvoice() {
      try {
        // Now this will return a Blob directly
        const blob = await reportClient.treatmentReportDownload();
  
        // Verify it's a Blob
        if (!(blob instanceof Blob)) {
          console.error('Response is not a Blob:', blob);
          throw new Error('Invalid response format');
        }
  
        // Check if blob has content
        if (blob.size === 0) {
          throw new Error('Downloaded file is empty');
        }
  
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'treatment.pdf';
        document.body.appendChild(link);
        link.click();
  
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
  
        toast.success(t('common:report-downloaded-successfully'));
      } catch (error: any) {
        console.error('Error downloading report:', error);
  
        // Check if error has response data (JSON error message)
        if (error.response?.data) {
          // Try to parse as JSON for error message
          try {
            const errorData = await error.response.data.text();
            const parsedError = JSON.parse(errorData);
            toast.error(
              parsedError.detail || t('common:error-downloading-report'),
            );
          } catch {
            toast.error(t('common:error-downloading-report'));
          }
        } else {
          toast.error(error.message || t('common:error-downloading-report'));
        }
      }
    }
  

  return (
    <>
      <Card className="flex flex-col items-center mb-8 md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-treatments')} />
        </div>

        <div className="flex flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/2">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
          />

          {locale === Config.defaultLanguage && (
            <LinkButton
              href={Routes.treatment.create}
              className="w-full h-12 md:w-auto md:ms-6"
            >
              <span>+ {t('form:button-label-add-treatment')}</span>
            </LinkButton>
          )}

            &nbsp; &nbsp;
                    <Button onClick={handleDownloadInvoice} className="bg-blue-500">
                      <DownloadIcon className="h-4 w-4 me-3" />
                      {t('common:Print')} 
                    </Button>
        </div>
      </Card>
      <TreatmentList
        treatments={treatments}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
    </>
  );
}

Treatments.authenticate = {
  permissions: adminOnly,
};

Treatments.Layout = Layout;
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
