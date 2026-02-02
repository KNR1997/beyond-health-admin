import {
  PatientPaginator,
  QueryOptions,
  Treatment,
  TreatmentInput,
  TreatmentQueryOptions,
  TreatmentPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const treatmentClient = {
  ...crudFactory<Treatment, QueryOptions, TreatmentInput>(
    API_ENDPOINTS.TREATMENTS,
  ),
  paginated: ({ name, ...params }: Partial<TreatmentQueryOptions>) => {
    return HttpClient.get<TreatmentPaginator>(API_ENDPOINTS.TREATMENTS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  statusChange: (variables: { id: string }) => {
    return HttpClient.post<{ id: string }>(
      API_ENDPOINTS.TREATMENT_STATUS_CHANGE,
      variables
    );
  },
};
