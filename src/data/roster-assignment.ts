import Router from 'next/router';
import { Config } from '@/config';
import { toast } from 'react-toastify';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useMutation, useQueryClient } from 'react-query';
import { rosterAssignmentClient } from './client/roster-assignment';
import { RosterAssignment } from '@/types';

export const useCreateRosterAssignmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(rosterAssignmentClient.create, {
    onSuccess: async (data: RosterAssignment) => {
      Router.push(Routes.roster.assignments(data.roster_week), undefined, {
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

export const useDeleteRosterAssignmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(rosterAssignmentClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROSTER_WEEKS);
    },
  });
};
