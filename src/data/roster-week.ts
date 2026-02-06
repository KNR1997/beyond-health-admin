import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Routes } from '@/config/routes';
import {
  RosterQueryOptions,
  GetParams,
  Roster,
  RosterPaginator,
  RosterAssignment,
  RosterAssignmentPaginator,
} from '@/types';
import { Config } from '@/config';
import { rosterClient } from './client/roster-week';
import { rosterAssignmentsKey } from '@/utils/queryKeys';

export const useRosterWeeksQuery = (options: Partial<RosterQueryOptions>) => {
  const { data, error, isLoading } = useQuery<RosterPaginator, Error>(
    [API_ENDPOINTS.ROSTER_WEEKS, options],
    ({ queryKey, pageParam }) =>
      rosterClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    rosters: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useRosterQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Roster, Error>(
    [API_ENDPOINTS.ROSTER_WEEKS, { slug, language }],
    () => rosterClient.get({ slug, language }),
  );
  return {
    roster: data,
    error,
    loading: isLoading,
  };
};

export const useCreateRosterMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(rosterClient.create, {
    onSuccess: () => {
      Router.push(Routes.roster.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROSTER_WEEKS);
    },
  });
};

export const useUpdateRosterMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(rosterClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.roster.list}`
        : Routes.roster.list;
      await router.push(`${generateRedirectUrl}/${data?.id}/edit`, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    // onSuccess: () => {
    //   toast.success(t('common:successfully-updated'));
    // },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROSTER_WEEKS);
    },
  });
};

export const useDeleteRosterMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(rosterClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROSTER_WEEKS);
    },
  });
};

export const useRosterWeekAssignmentsQuery = ({
  rosterWeekId,
}: {
  rosterWeekId: string;
}) => {
  const { data, error, isLoading } = useQuery<RosterAssignmentPaginator, Error>(
    rosterAssignmentsKey(rosterWeekId),
    () => rosterClient.assignments(rosterWeekId),
  );

  return {
    rosterAssignments: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
