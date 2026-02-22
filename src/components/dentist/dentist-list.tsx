import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { Dentist, Patient, SortOrder, User } from '@/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { MappedPaginatorInfo } from '@/types';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useIsRTL } from '@/utils/locals';
import Avatar from '@/components/common/avatar';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  dentists: Dentist[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const DentistList = ({
  dentists,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc
          ? SortOrder.Asc
          : SortOrder.Desc,
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      render: (name: string, record: Dentist) => (
        <div className="flex items-center">
          <Avatar name={name} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {record?.user?.first_name} {record?.user?.last_name}
            <span className="text-[13px] font-normal text-gray-500/80">
              {record?.user?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t('table:table-item-specialization'),
      className: 'cursor-pointer',
      dataIndex: 'specialization',
      key: 'specialization',
      align: 'center',
      width: 250,
      onHeaderCell: () => onHeaderClick('specialization'),
      render: (specialization: string) => (
        <span className="whitespace-nowrap">{specialization}</span>
      ),
    },
    {
      title: t('table:table-item-license-number'),
      className: 'cursor-pointer',
      dataIndex: 'license_number',
      key: 'license_number',
      align: 'center',
      width: 250,
      onHeaderCell: () => onHeaderClick('license_number'),
      render: (license_number: string) => (
        <span className="whitespace-nowrap">{license_number}</span>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right',
      width: 260,
      render: (id: string, record: Dentist) => (
        <LanguageSwitcher
          slug={id}
          record={record}
          deleteModalView="DELETE_COUPON"
          deleteBySlug={record.id}
          routes={Routes?.dentist}
          showResetDentistPasswordButton={true}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="pt-6 mb-1 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={dentists}
          rowKey="id"
          scroll={{ x: 900 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default DentistList;
