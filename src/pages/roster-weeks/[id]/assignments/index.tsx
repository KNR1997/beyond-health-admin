import cn from 'classnames';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Menu, Transition } from '@headlessui/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// types
import { Shift, User } from '@/types';
// utils
import { adminOnly } from '@/utils/auth-utils';
// client
import { reportClient } from '@/data/client/report';
// config
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// hooks
import { useRosterWeekAssignmentsQuery } from '@/data/roster-week';
// components
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import { ArrowUp } from '@/components/icons/arrow-up';
import { MoreIcon } from '@/components/icons/more-icon';
import ErrorMessage from '@/components/ui/error-message';
import { ArrowDown } from '@/components/icons/arrow-down';
import PageHeading from '@/components/common/page-heading';
import { DownloadIcon } from '@/components/icons/download-icon';
import RosterPageHeader from '@/components/roster/roster-page-header';
import RosterAssignmentList from '@/components/roster-assignment/roster-assignment-list';
import RosterAssignmentFilter from '@/components/roster-assignment/roster-assignment-filter';

export default function RosterWeeks() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  // states
  const [page, setPage] = useState(1);
  const [date, setDate] = useState('');
  const [employee, setEmployee] = useState('');
  const [role, setRole] = useState('');
  const [shift, setShift] = useState('');
  const [visible, setVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  // query
  const {
    rosterAssignments,
    paginatorInfo,
    loading: loading,
    error,
  } = useRosterWeekAssignmentsQuery({
    rosterWeekId: query.id as string,
    limit: 20,
    page,
    date: date,
    user__id: employee,
    user__role: role,
    shift: shift,
    ordering,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  async function handleDownload() {
    try {
      // Now this will return a Blob directly
      const blob = await reportClient.rosterReportDownload({
        rosterWeekId: query.id as string,
      });

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
      link.download = 'dental-problem.pdf';
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
      <RosterPageHeader
        pageTitle="form:form-title-edit-roster"
        rosterWeekId={query.id as string}
      />
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <PageHeading title={t('common:sidebar-nav-item-rosters')} />
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-1/2 md:flex-row md:space-y-0">
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
                        <span className="whitespace-nowrap">Export Roster</span>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
            {locale === Config.defaultLanguage && (
              <LinkButton
                href={`${Routes.roster.assignmentCreate(query.id as string)}`}
                className="h-12 w-full md:w-auto md:ms-6"
              >
                <span className="block md:hidden xl:block">
                  + {t('form:button-label-add-assignment')}
                </span>
                <span className="hidden md:block xl:hidden">
                  + {t('form:button-label-add')}
                </span>
              </LinkButton>
            )}
          </div>
          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>
        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <RosterAssignmentFilter
              className="md:ms-6"
              onDateFilter={(option: any) => {
                setDate(option);
                setPage(1);
              }}
              onEmployeeFilter={(option: User) => {
                setEmployee(option?.id);
                setPage(1);
              }}
              onRoleFilter={(option: { name: string; value: string }) => {
                setRole(option?.value);
                setPage(1);
              }}
              onShiftFilter={(option: Shift) => {
                setShift(option?.id);
                setPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      <RosterAssignmentList
        rosterAssignments={rosterAssignments}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
    </>
  );
}

RosterWeeks.authenticate = {
  permissions: adminOnly,
};
RosterWeeks.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
