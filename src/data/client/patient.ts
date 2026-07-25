import {
  PatientQueryOptions,
  Patient,
  PatientInput,
  PatientPaginator,
  QueryOptions,
  TreatmentPlanPaginator,
  TreatmentPlanQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const patientClient = {
  ...crudFactory<Patient, QueryOptions, PatientInput>(API_ENDPOINTS.PATIENTS),
  paginated: ({ name, ...params }: Partial<PatientQueryOptions>) => {
    return HttpClient.get<PatientPaginator>(API_ENDPOINTS.PATIENTS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  treatmentPlans: (patientId: string) => {
    return HttpClient.get<TreatmentPlanPaginator>(
      `${API_ENDPOINTS.PATIENTS}/${patientId}/treatment-plans`,
    );
  },
};
