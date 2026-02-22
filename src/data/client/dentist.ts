import {
  QueryOptions,
  DentistInput,
  Dentist,
  DentistPaginator,
  DentistQueryOptions,
  DentistResetPasswordInput,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const dentistClient = {
  ...crudFactory<Dentist, QueryOptions, DentistInput>(API_ENDPOINTS.DENTISTS),
  paginated: ({ name, ...params }: Partial<DentistQueryOptions>) => {
    return HttpClient.get<DentistPaginator>(API_ENDPOINTS.DENTISTS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  resetPassword: (data: DentistResetPasswordInput) => {
    return HttpClient.post(`${API_ENDPOINTS.DENTISTS}/reset-password`, data);
  },
};
