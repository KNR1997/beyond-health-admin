import dayjs from 'dayjs';
import { useState } from 'react';
import { format } from 'date-fns';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
import relativeTime from 'dayjs/plugin/relativeTime';
// config
import { Routes } from '@/config/routes';
//utils
import { useIsRTL } from '@/utils/locals';
// types
import { MappedPaginatorInfo } from '@/types';
import { Appointment, SortOrder } from '@/types';
// components
import { Table } from '@/components/ui/table';
import Avatar from '@/components/common/avatar';
import Badge from '@/components/ui/badge/badge';
import Pagination from '@/components/ui/pagination';
import ActionButtons from '@/components/common/action-buttons';
import { NoDataFound } from '@/components/icons/no-data-found';
import StatusColor from '@/components/appointment/status-color';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  appointments: Appointment[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onOrdering: (current: any) => void;
};

const MyAppointmentList = ({
  appointments,
  paginatorInfo,
  onPagination,
  onOrdering,
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
      const nextSort =
        sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;

      const ordering = nextSort === SortOrder.Desc ? `-${column}` : column;

      onOrdering(ordering);
      setSortingObj({
        sort: nextSort,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: 'Appointment No.',
      className: 'cursor-pointer',
      dataIndex: 'appointment_no',
      key: 'appointment_no',
      align: alignLeft,
      width: 200,
      onHeaderCell: () => onHeaderClick('appointment_no'),
    },
    {
      title: t('table:table-item-patient'),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      render: (name: string, record: Appointment) => (
        <div className="flex items-center">
          <Avatar name={record?.patient?.name} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {record?.patient?.name}
            <span className="text-[13px] font-normal text-gray-500/80">
              {record?.patient?.mobile_number}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Dentist',
      className: 'cursor-pointer',
      dataIndex: 'dentist',
      key: 'dentist',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      render: (name: string, record: Appointment) => (
        <div className="flex items-center">
          <Avatar name={record?.dentist?.user?.first_name} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {record?.dentist?.user?.first_name}{' '}
            {record?.dentist?.user?.last_name}
            <span className="text-[13px] font-normal text-gray-500/80">
              {record?.dentist?.user?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t('table:table-item-appointment-date'),
      className: 'cursor-pointer',
      dataIndex: 'appointment_date',
      key: 'appointment_date',
      align: 'center',
      width: 150,
      onHeaderCell: () => onHeaderClick('appointment_date'),
      render: (appointment_date: string) => (
        <span className="whitespace-nowrap">
          {format(new Date(appointment_date), 'yyyy-MM-dd')}
        </span>
      ),
    },
    {
      title: t('table:table-item-status'),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 120,
      onHeaderCell: () => onHeaderClick('status'),
      render: (order_status: string) => (
        <Badge
          text={t(order_status)}
          color={StatusColor(order_status)}
          className="capitalize"
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right',
      width: 160,
      render: (id: string, record: Appointment) => (
        <ActionButtons
          id={id}
          detailsUrl={`${Routes.myAppointments.list}/${id}/details`}
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
          data={appointments}
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

export default MyAppointmentList;
