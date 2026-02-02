import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import {
  DentalProblem,
  DentalProblemPaginator,
  DentalProblemQueryOptions,
  GetParams,
} from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { dentalProblemClient } from './client/dental-problem';

export const useDentalProblemsQuery = (
  options: Partial<DentalProblemQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<DentalProblemPaginator, Error>(
    [API_ENDPOINTS.DENTAL_PROBLEMS, options],
    ({ queryKey, pageParam }) =>
      dentalProblemClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    dentalProblems: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useDentalProblemQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<DentalProblem, Error>(
    [API_ENDPOINTS.DENTAL_PROBLEMS, { slug, language }],
    () => dentalProblemClient.get({ slug, language }),
  );

  return {
    dentalProblem: data,
    error,
    loading: isLoading,
  };
};

export const useCreateDentalProblemMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(dentalProblemClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.dentalProblem.list}`
        : Routes.dentalProblem.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.DENTAL_PROBLEMS);
    },
  });
};

export const useUpdateDentalProblemMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(dentalProblemClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.dentalProblem.list}`
        : Routes.dentalProblem.list;
      await router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });

      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DENTAL_PROBLEMS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useDeleteDentalProblemMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(dentalProblemClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DENTAL_PROBLEMS);
    },
  });
};

export const useDentalProblemStatusChangeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(dentalProblemClient.statusChange, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DENTAL_PROBLEMS);
    },
  });
};
