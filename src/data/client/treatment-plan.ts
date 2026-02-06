import {
  AddStaffInput,
  AddTreatmentPlanItemsInput,
  QueryOptions,
  TreatmentPlan,
  TreatmentPlanInput,
  TreatmentPlanItem,
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
    return HttpClient.get<TreatmentPlanPaginator>(
      API_ENDPOINTS.TREATMENT_PLANS,
      {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      },
    );
  },
  planItems: (treatmentPlanId: string) => {
    return HttpClient.get<TreatmentPlanItem[]>(
      `${API_ENDPOINTS.TREATMENT_PLANS}/${treatmentPlanId}/items`,
    );
  },
  createItems: (input: AddTreatmentPlanItemsInput) => {
    return HttpClient.post<any>(
      `${API_ENDPOINTS.TREATMENT_PLANS}/${input.treatment_plan_id}/items`,
      input,
    );
  },
  updateItems: (input: AddTreatmentPlanItemsInput) => {
    return HttpClient.put<any>(
      `${API_ENDPOINTS.TREATMENT_PLANS}/${input.treatment_plan_id}/items`,
      input,
    );
  },
};
