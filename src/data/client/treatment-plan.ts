import {
  QueryOptions,
  TreatmentPlan,
  TreatmentPlanInput,
  TreatmentPlanPaginator,
  TreatmentPlanQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const treatmentPlanClient = {
  ...crudFactory<TreatmentPlan, QueryOptions, TreatmentPlanInput>(
    API_ENDPOINTS.TREATMENT_PLANS,
  ),
  paginated: ({ name, ...params }: Partial<TreatmentPlanQueryOptions>) => {
    return HttpClient.get<TreatmentPlanPaginator>(API_ENDPOINTS.TREATMENT_PLANS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
