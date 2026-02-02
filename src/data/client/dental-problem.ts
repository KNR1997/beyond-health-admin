import {
  PatientPaginator,
  QueryOptions,
  DentalProblem,
  DentalProblemInput,
  DentalProblemQueryOptions,
  DentalProblemPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const dentalProblemClient = {
  ...crudFactory<DentalProblem, QueryOptions, DentalProblemInput>(
    API_ENDPOINTS.DENTAL_PROBLEMS,
  ),
  paginated: ({ name, ...params }: Partial<DentalProblemQueryOptions>) => {
    return HttpClient.get<DentalProblemPaginator>(API_ENDPOINTS.DENTAL_PROBLEMS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  statusChange: (variables: { id: string }) => {
    return HttpClient.post<{ id: string }>(
      API_ENDPOINTS.DENTAL_PROBLEM_STATUS_CHANGE,
      variables
    );
  },
};
