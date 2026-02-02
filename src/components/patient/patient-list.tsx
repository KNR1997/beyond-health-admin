import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { Patient, SortOrder, User } from '@/types';
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
import Badge from '@/components/ui/badge/badge';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  patients: Patient[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const PatientList = ({
  patients,
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
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-id')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
    //       }
    //       isActive={sortingObj.column === 'id'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: alignLeft,
    //   width: 120,
    //   onHeaderCell: () => onHeaderClick('id'),
    //   render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    // },
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
      render: (name: string, record: Patient) => (
        <div className="flex items-center">
          <Avatar name={name} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {name}
            <span className="text-[13px] font-normal text-gray-500/80">
              {record?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t('table:table-item-gender'),
      className: 'cursor-pointer',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      width: 250,
      onHeaderCell: () => onHeaderClick('gender'),
      render: (gender: string) => (
        <span className="whitespace-nowrap">{gender}</span>
      ),
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-status')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc &&
    //         sortingObj.column === 'is_active'
    //       }
    //       isActive={sortingObj.column === 'is_active'}
    //     />
    //   ),
    //   width: 150,
    //   className: 'cursor-pointer',
    //   dataIndex: 'is_active',
    //   key: 'is_active',
    //   align: 'center',
    //   onHeaderCell: () => onHeaderClick('is_active'),
    //   render: (is_active: boolean, record: Patient) => (
    //     <Badge
    //       textKey={
    //         record?.user.is_active
    //           ? 'common:text-active'
    //           : 'common:text-inactive'
    //       }
    //       color={
    //         record?.user.is_active
    //           ? 'bg-accent/10 !text-accent'
    //           : 'bg-status-failed/10 text-status-failed'
    //       }
    //     />
    //   ),
    // },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right',
      width: 260,
      render: (id: string, record: Patient) => (
        <LanguageSwitcher
          slug={id}
          record={record}
          deleteModalView="DELETE_COUPON"
          deleteBySlug={record.id}
          routes={Routes?.patient}
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
          data={patients}
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

export default PatientList;
