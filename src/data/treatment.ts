import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import {
  Treatment,
  TreatmentPaginator,
  TreatmentQueryOptions,
  GetParams,
} from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { treatmentClient } from './client/treatment';

export const useTreatmentsQuery = (options: Partial<TreatmentQueryOptions>) => {
  const { data, error, isLoading } = useQuery<TreatmentPaginator, Error>(
    [API_ENDPOINTS.TREATMENTS, options],
    ({ queryKey, pageParam }) =>
      treatmentClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    treatments: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useTreatmentQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Treatment, Error>(
    [API_ENDPOINTS.TREATMENTS, { slug, language }],
    () => treatmentClient.get({ slug, language }),
  );

  return {
    treatment: data,
    error,
    loading: isLoading,
  };
};

export const useCreateTreatmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(treatmentClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.treatment.list}`
        : Routes.treatment.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.TREATMENTS);
    },
  });
};

export const useUpdateTreatmentMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(treatmentClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.treatment.list}`
        : Routes.treatment.list;
      await router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });

      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TREATMENTS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useDeleteTreatmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(treatmentClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TREATMENTS);
    },
  });
};

export const useTreatmentStatusChangeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(treatmentClient.statusChange, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TREATMENTS);
    },
  });
};
