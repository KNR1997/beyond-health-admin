import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { dentistClient } from './client/dentist';
import {
  DentistQueryOptions,
  GetParams,
  Dentist,
  DentistPaginator,
} from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';

export const useDentistsQuery = (options: Partial<DentistQueryOptions>) => {
  const { data, error, isLoading } = useQuery<DentistPaginator, Error>(
    [API_ENDPOINTS.DENTISTS, options],
    ({ queryKey, pageParam }) =>
      dentistClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    dentists: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useDentistQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<Dentist, Error>(
    [API_ENDPOINTS.DENTISTS, { slug }],
    () => dentistClient.get({ slug }),
  );

  return {
    dentist: data,
    error,
    loading: isLoading,
  };
};

export const useCreateDentistMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(dentistClient.create, {
    onSuccess: async (data: Dentist) => {
      const generateRedirectUrl = Routes.dentist.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    onError: (error: any) => {
      // toast.error(t(`comon:${error?.response?.data.error}`));
      toast.error(error?.response?.data.error);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DENTISTS);
    },
  });
};

export const useUpdateDentistMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(dentistClient.update, {
    onSuccess: async (data) => {
      await router.push(Routes.dentist.list, undefined, {
        locale: Config.defaultLanguage,
      });

      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DENTISTS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useDeleteDentistMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(dentistClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DENTISTS);
    },
  });
};

export const useDentistResetPasswordMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(dentistClient.resetPassword, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DENTISTS);
    },
  });
};
