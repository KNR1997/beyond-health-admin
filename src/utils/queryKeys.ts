import { API_ENDPOINTS } from "@/data/client/api-endpoints";

export const treatmentPlanItemsKey = (treatmentPlanId: string) => [
  API_ENDPOINTS.TREATMENT_PLAN_ITEMS,
  treatmentPlanId,
];

export const rosterAssignmentsKey = (rosterWeekId: string) => [
  API_ENDPOINTS.ROSTER_WEEKS,
  rosterWeekId,
];