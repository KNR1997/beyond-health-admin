import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
//utils
import { mapPaginatorData } from '@/utils/data-mappers';
//types
import {
  AppointmentQueryOptions,
  GetParams,
  Appointment,
  AppointmentPaginator,
} from '@/types';
//configs
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import { appointmentClient } from './client/appointment';
import { API_ENDPOINTS } from './client/api-endpoints';

export const useAppointmentsQuery = (options: Partial<AppointmentQueryOptions>) => {
  const { data, error, isLoading } = useQuery<AppointmentPaginator, Error>(
    [API_ENDPOINTS.APPOINTMENTS, options],
    ({ queryKey, pageParam }) =>
      appointmentClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    appointments: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useAppointmentQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<Appointment, Error>(
    [API_ENDPOINTS.APPOINTMENTS, { slug }],
    () => appointmentClient.get({ slug }),
  );

  return {
    appointment: data,
    error,
    loading: isLoading,
  };
};

export const useCreateAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(appointmentClient.create, {
    onSuccess: async (data: Appointment) => {
      const generateRedirectUrl = Routes.appointment.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.APPOINTMENTS);
    },
  });
};

export const useUpdateAppointmentMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(appointmentClient.update, {
    onSuccess: async (data) => {
      await router.push(Routes.appointment.list, undefined, {
        locale: Config.defaultLanguage,
      });

      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.APPOINTMENTS);
    },
    // onError: (error: any) => {
    //   toast.error(t(`common:${error?.response?.data.message}`));
    // },
  });
};

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(appointmentClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.APPOINTMENTS);
    },
  });
};
