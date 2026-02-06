import { useState } from 'react';
import { useTranslation } from 'next-i18next';
// utils
import { useIsRTL } from '@/utils/locals';
// config
import { Routes } from '@/config/routes';
// types
import { Roster, RosterAssignment, Shift, SortOrder, User } from '@/types';
import { MappedPaginatorInfo, Tag } from '@/types';
// components
import { Table } from '@/components/ui/table';
import Badge from '@/components/ui/badge/badge';
import Pagination from '@/components/ui/pagination';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Avatar from '../common/avatar';

export type IProps = {
  rosterAssignments: RosterAssignment[] | undefined | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  paginatorInfo: MappedPaginatorInfo | null;
};

const RosterAssignmentList = ({
  rosterAssignments,
  onPagination,
  onSort,
  onOrder,
  paginatorInfo,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

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
          title={t('table:table-item-date')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'date',
      key: 'date',
      align: alignLeft,
      width: 220,
      onHeaderCell: () => onHeaderClick('date'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-employee')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'user',
      key: 'user',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('user'),
      render: (
        user: User,
        { profile, email }: { profile: any; email: string },
      ) => (
        <div className="flex items-center">
          <Avatar name={user.first_name} src={profile?.avatar?.thumbnail} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {user?.first_name} {user?.last_name}
            <span className="text-[13px] font-normal text-gray-500/80">
              {user?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t('table:table-item-role'),
      dataIndex: 'assigned_role',
      key: 'assigned_role',
      align: 'center',
      width: 250,
      // onHeaderCell: () => onHeaderClick('week_end_date'),
    },
    {
      title: t('table:table-item-shift'),
      dataIndex: 'shift',
      key: 'shift',
      align: 'center',
      width: 250,
      render: (shift: Shift, record: any) => (
        <div>
          <Badge
            text={shift.code}
            color={
              shift?.code?.toLowerCase() === 'morning'
                ? 'bg-green-400/10 text-green-500'
                : shift?.code?.toLowerCase() === 'evening'
                  ? 'bg-orange-400/10 text-orange-500'
                  : shift?.code?.toLowerCase() === 'night'
                    ? 'bg-red-400/10 text-red-500'
                    : 'bg-accent/10 text-accent'
            }
            className="capitalize"
          />
        </div>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      width: 120,
      render: (id: string, record: Tag) => (
        <LanguageSwitcher
          slug={id}
          record={record}
          deleteModalView="DELETE_ROSTER_ASSIGNMENT"
          deleteBySlug={record.slug}
          routes={Routes?.roster}
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
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          //@ts-ignore
          data={rosterAssignments}
          rowKey="id"
          scroll={{ x: 1000 }}
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

export default RosterAssignmentList;
