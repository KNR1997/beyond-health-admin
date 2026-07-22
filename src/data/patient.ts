import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import Router, { useRouter } from 'next/router';
import { mapPaginatorData } from '@/utils/data-mappers';
import { useQuery, useMutation, useQueryClient } from 'react-query';
// configs
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// clients
import { patientClient } from './client/patient';
import { API_ENDPOINTS } from './client/api-endpoints';
// types
import {
  GetParams,
  Patient,
  PatientPaginator,
  PatientQueryOptions,
} from '@/types';

export const useCreatePatientMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(patientClient.create, {
    onSuccess: async (data: Patient) => {
      await Router.push(Routes.patient.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PATIENTS);
    },
    onError: (error: any) => {
      if (error?.status == 400) {
        toast.error(t('common:PICKBAZAR_ERROR.BAD_REQUEST'));
      } else {
        toast.error(t(`common:${error?.response?.data.message}`));
      }
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
      if (error?.status == 400) {
        toast.error(t('common:PICKBAZAR_ERROR.BAD_REQUEST'));
      } else {
        toast.error(t(`common:${error?.response?.data.message}`));
      }
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
