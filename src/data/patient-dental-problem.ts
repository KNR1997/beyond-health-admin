import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { patientDentalProblemClient } from './client/patient-dental-problem';
import { PatientDentalProblem } from '@/types';

export const usePatientDentalProblemsQuery = (patientId: string) => {
  const { data, error, isLoading } = useQuery<PatientDentalProblem[], Error>(
    [API_ENDPOINTS.PATIENT_DENTAL_PROBLEMS, patientId],
    () => patientDentalProblemClient.all(patientId),
    {
      keepPreviousData: true,
    },
  );

  return {
    patientDentalProblems: data ?? [],
    // paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useCreatePatientDentalProblemMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(patientDentalProblemClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.patient.list}`
        : Routes.patient.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.PATIENT_DENTAL_PROBLEMS);
    },
  });
};

export const useUpdatePatientDentalProblemMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(patientDentalProblemClient.update, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.patient.list}`
        : Routes.patient.list;
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
