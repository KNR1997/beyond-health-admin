import {
  Appointment,
  AppointmentPaginator,
  AppointmentQueryOptions,
  CreateAppointmentInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const appointmentClient = {
  ...crudFactory<Appointment, QueryOptions, CreateAppointmentInput>(
    API_ENDPOINTS.APPOINTMENTS
  ),
  paginated: ({ name, ...params }: Partial<AppointmentQueryOptions>) => {
    return HttpClient.get<AppointmentPaginator>(API_ENDPOINTS.APPOINTMENTS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
