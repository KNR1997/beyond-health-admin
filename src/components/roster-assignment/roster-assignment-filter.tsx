import cn from 'classnames';
import { format } from 'date-fns';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ActionMeta } from 'react-select';
import { useTranslation } from 'next-i18next';
import 'react-datepicker/dist/react-datepicker.css';
// constants
import { roleOptions } from '@/constants';
// hooks
import { useUsersQuery } from '@/data/user';
import { useShiftsQuery } from '@/data/shift';
// types
import { Shift, User } from '@/types';
// components
import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';

type Props = {
  onEmployeeFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onRoleFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onShiftFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onDateFilter?: (date: string | null) => void; // Add this prop
  className?: string;
};

export default function RosterAssignmentFilter({
  onEmployeeFilter,
  onRoleFilter,
  onShiftFilter,
  onDateFilter,
  className,
}: Props) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { shifts, loading: shiftLoading } = useShiftsQuery({
    limit: 999,
  });
  const { users, loading: usersLoading } = useUsersQuery({
    limit: 999,
  });

 const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (onDateFilter) {
      // Format the date as YYYY-MM-DD and pass to parent
      const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;
      onDateFilter(formattedDate);
    }
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className,
      )}
    >
      {/* Date Filter */}
      <div className="w-full">
        <Label>Filter By Date</Label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select Date"
          className="w-full border border-border-base px-4 h-12 rounded transition duration-300 ease-in-out text-heading text-sm cursor-pointer"
          dateFormat="MMMM d, yyyy"
          isClearable
        />
      </div>

      <div className="w-full">
        <Label>Filter By Employee</Label>
        <Select
          options={users}
          // @ts-ignore
          getOptionLabel={(option: User) =>
            `${option?.first_name} ${option?.last_name}`
          }
          // @ts-ignore
          getOptionValue={(option: User) => option.id}
          placeholder="Filter By Employee"
          isLoading={usersLoading}
          onChange={onEmployeeFilter}
          isClearable={true}
        />
      </div>

      <div className="w-full">
        <Label>Filter by Role</Label>
        <Select
          options={roleOptions}
          //@ts-ignore
          getOptionLabel={(option: any) => option.label}
          //@ts-ignore
          getOptionValue={(option: any) => option.value}
          placeholder={t('common:filter-by-role-placeholder')}
          onChange={onRoleFilter}
          isClearable={true}
        />
      </div>

      <div className="w-full">
        <Label>Filter by Shift</Label>
        <Select
          options={shifts}
          //@ts-ignore
          getOptionLabel={(option: Shift) => option.code}
          //@ts-ignore
          getOptionValue={(option: Shift) => option.id}
          placeholder="Filter by Shift"
          onChange={onShiftFilter}
          isLoading={shiftLoading}
          isClearable={true}
        />
      </div>
    </div>
  );
}
