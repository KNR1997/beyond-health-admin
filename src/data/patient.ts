import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { patientClient } from './client/patient';
import {
  GetParams,
  Patient,
  PatientPaginator,
  PatientQueryOptions,
} from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';

export const useCreatePatientMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(patientClient.create, {
    onSuccess: async (data: Patient) => {
      const generateRedirectUrl = data.id
        ? Routes.patient.diseases(data.id)
        : Routes.patient.list;
      await Router.push(Routes.patient.list, undefined, {
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
      queryClient.invalidateQueries(API_ENDPOINTS.PATIENTS);
    },
  });
};

export const useDeletePatientMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(patientClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PATIENTS);
    },
  });
};

export const useUpdatePatientMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(patientClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = data.id
        ? Routes.patient.diseases(data.id)
        : Routes.patient.list;
      await router.push(Routes.patient.list, undefined, {
        locale: Config.defaultLanguage,
      });

      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PATIENTS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const usePatientQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<Patient, Error>(
    [API_ENDPOINTS.PATIENTS, { slug }],
    () => patientClient.get({ slug }),
  );

  return {
    patient: data,
    error,
    loading: isLoading,
  };
};

export const usePatientsQuery = (options: Partial<PatientQueryOptions>) => {
  const { data, error, isLoading } = useQuery<PatientPaginator, Error>(
    [API_ENDPOINTS.PATIENTS, options],
    ({ queryKey, pageParam }) =>
      patientClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    patients: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
