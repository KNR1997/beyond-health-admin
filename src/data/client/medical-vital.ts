import {
  QueryOptions,
  MedicalVital,
  MedicalVitalInput,
  MedicalVitalQueryOptions,
  MedicalVitalPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const medicalVitalClient = {
  ...crudFactory<MedicalVital, QueryOptions, MedicalVitalInput>(
    API_ENDPOINTS.MEDICAL_VITALS,
  ),
  paginated: ({ name, ...params }: Partial<MedicalVitalQueryOptions>) => {
    return HttpClient.get<MedicalVitalPaginator>(API_ENDPOINTS.MEDICAL_VITALS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  // statusChange: (variables: { id: string }) => {
  //   return HttpClient.post<{ id: string }>(
  //     API_ENDPOINTS.DENTAL_PROBLEM_STATUS_CHANGE,
  //     variables
  //   );
  // },
};
