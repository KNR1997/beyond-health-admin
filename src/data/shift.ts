import { ShiftPaginator, StaffQueryOptions } from '@/types';
import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { shiftClient } from './client/shift';
import { mapPaginatorData } from '@/utils/data-mappers';

export const useShiftsQuery = (
  params: Partial<StaffQueryOptions>,
  options: any = {},
) => {
  const { data, error, isLoading } = useQuery<ShiftPaginator, Error>(
    [API_ENDPOINTS.SHIFTS, params],
    ({ queryKey, pageParam }) =>
      shiftClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    },
  );
  return {
    shifts: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
