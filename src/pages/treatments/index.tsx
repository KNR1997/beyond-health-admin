import classNames from 'classnames';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Menu, Transition } from '@headlessui/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// configs
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// utils
import { adminAndStaffOnly } from '@/utils/auth-utils';
// client
import { reportClient } from '@/data/client/report';
// hooks
import { useTreatmentsQuery } from '@/data/treatment';
// components
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import Layout from '@/components/layouts/app';
import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import { MoreIcon } from '@/components/icons/more-icon';
import ErrorMessage from '@/components/ui/error-message';
import PageHeading from '@/components/common/page-heading';
import { DownloadIcon } from '@/components/icons/download-icon';
import TreatmentList from '@/components/treatment/treatment-list';

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

  async function handleDownload() {
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
          <Menu
            as="div"
            className="relative inline-block ltr:text-left rtl:text-right"
          >
            <Menu.Button className="group p-2">
              <MoreIcon className="w-3.5 text-body" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                as="ul"
                className={classNames(
                  'shadow-700 absolute z-50 mt-2 w-52 overflow-hidden rounded border border-border-200 bg-light py-2 focus:outline-none ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left',
                )}
              >
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleDownload}
                      className={classNames(
                        'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 hover:text-accent focus:outline-none rtl:space-x-reverse',
                        active ? 'text-accent' : 'text-body',
                      )}
                    >
                      <DownloadIcon className="w-5 shrink-0" />
                      <span className="whitespace-nowrap">
                        Export Treatments
                      </span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
          {locale === Config.defaultLanguage && (
            <LinkButton
              href={Routes.treatment.create}
              className="w-full h-12 md:w-auto md:ms-6"
            >
              <span>+ {t('form:button-label-add-treatment')}</span>
            </LinkButton>
          )}

          {/* <Button onClick={handleDownloadInvoice} className="bg-blue-500">
                      <DownloadIcon className="h-4 w-4 me-3" />
                      {t('common:Print')} 
                    </Button> */}
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
  permissions: adminAndStaffOnly,
};
Treatments.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
