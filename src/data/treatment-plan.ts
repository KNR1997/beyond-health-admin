import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import {
  GetParams,
  TreatmentPlan,
  TreatmentPlanPaginator,
  TreatmentPlanQueryOptions,
} from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { treatmentPlanClient } from './client/treatment-plan';

export const useTreatmentPlansQuery = (options: Partial<TreatmentPlanQueryOptions>) => {
  const { data, error, isLoading } = useQuery<TreatmentPlanPaginator, Error>(
    [API_ENDPOINTS.TREATMENT_PLANS, options],
    ({ queryKey, pageParam }) =>
      treatmentPlanClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    treatmentPlans: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useTreatmentPlanQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<TreatmentPlan, Error>(
    [API_ENDPOINTS.TREATMENTS, { slug, language }],
    () => treatmentPlanClient.get({ slug, language }),
  );

  return {
    treatmentPlan: data,
    error,
    loading: isLoading,
  };
};

export const useCreateTreatmentPlanMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(treatmentPlanClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.treatmentPlan.list}`
        : Routes.treatmentPlan.list;
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

export const useUpdateTreatmentPlanMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(treatmentPlanClient.update, {
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

export const useDeleteTreatmentPlanMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(treatmentPlanClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TREATMENTS);
    },
  });
};
